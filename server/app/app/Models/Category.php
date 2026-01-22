<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'description',
        'icon',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Boot method para auto-generar slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug) && !empty($category->name)) {
                $category->slug = static::generateUniqueSlug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && (empty($category->slug) || $category->slug === static::generateUniqueSlug($category->getOriginal('name')))) {
                $category->slug = static::generateUniqueSlug($category->name, $category->id);
            }
        });
    }

    // Generate unique slug
    protected static function generateUniqueSlug(string $name, $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->when($ignoreId, function ($query, $id) {
            return $query->where('id', '!=', $id);
        })->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    // Accessors & Mutators
    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? ucwords(strtolower(trim($value))) : null,
        );
    }

    protected function slug(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? Str::slug($value) : null,
        );
    }

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    public function contractors()
    {
        return $this->belongsToMany(Contractor::class, 'contractor_categories')
            ->withTimestamps();
    }

    public function professions()
    {
        return $this->belongsToMany(Profession::class, 'category_professions')
            ->withTimestamps();
    }

    // Scopes
    public function scopeParents(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function scopeChildren(Builder $query): Builder
    {
        return $query->whereNotNull('parent_id');
    }

    public function scopeByParent(Builder $query, ?int $parentId): Builder
    {
        return $query->where('parent_id', $parentId);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(slug) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeBySlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', $slug);
    }

    public function scopeSort(Builder $query, string $sortBy = 'name', string $sortDir = 'asc'): Builder
    {
        $allowedSorts = ['name', 'slug', 'created_at', 'updated_at'];

        if (in_array($sortBy, $allowedSorts)) {
            return $query->orderBy($sortBy, $sortDir);
        }

        return $query->orderBy('name', 'asc');
    }

    public function scopeWithChildrenCount(Builder $query): Builder
    {
        return $query->withCount('children');
    }

    public function scopeWithContractorsCount(Builder $query): Builder
    {
        return $query->withCount('contractors');
    }

    public function scopeWithProfessionsCount(Builder $query): Builder
    {
        return $query->withCount('professions');
    }

    // Helper methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function isParent(): bool
    {
        return is_null($this->parent_id);
    }

    public function isChild(): bool
    {
        return !is_null($this->parent_id);
    }

    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    public function hasContractors(): bool
    {
        return $this->contractors()->exists();
    }

    public function hasProfessions(): bool
    {
        return $this->professions()->exists();
    }

    public function getDepth(): int
    {
        $depth = 0;
        $parent = $this->parent;

        while ($parent) {
            $depth++;
            $parent = $parent->parent;
        }

        return $depth;
    }

    public function getPath(): string
    {
        $path = [];
        $category = $this;

        while ($category) {
            array_unshift($path, $category->name);
            $category = $category->parent;
        }

        return implode(' > ', $path);
    }

    public function getAllDescendants(): \Illuminate\Database\Eloquent\Collection
    {
        $descendants = collect();
        
        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->getAllDescendants());
        }

        return $descendants;
    }

    public function canBeDeleted(): bool
    {
        return !$this->hasChildren() && !$this->hasContractors() && !$this->hasProfessions();
    }

    // Tree structure helpers
    public static function getTree(): \Illuminate\Database\Eloquent\Collection
    {
        return static::with('allChildren')
            ->parents()
            ->orderBy('name')
            ->get();
    }

    public function toTreeArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'parent_id' => $this->parent_id,
            'depth' => $this->getDepth(),
            'path' => $this->getPath(),
            'children' => $this->children->map(function ($child) {
                return $child->toTreeArray();
            })->toArray()
        ];
    }

    // ===============================
    // MÉTODOS ESPECIALES PARA SUBCATEGORÍAS
    // ===============================

    /**
     * Agregar una subcategoría a esta categoría
     */
    public function addSubcategory(array $subcategoryData): Category
    {
        $subcategoryData['parent_id'] = $this->id;
        
        // Auto-generar slug si no se proporciona
        if (empty($subcategoryData['slug']) && !empty($subcategoryData['name'])) {
            $subcategoryData['slug'] = static::generateUniqueSlug($subcategoryData['name']);
        }

        return static::create($subcategoryData);
    }

    /**
     * Agregar múltiples subcategorías de una vez
     */
    public function addSubcategories(array $subcategoriesData): array
    {
        $createdSubcategories = [];

        foreach ($subcategoriesData as $subcategoryData) {
            $createdSubcategories[] = $this->addSubcategory($subcategoryData);
        }

        return $createdSubcategories;
    }

    /**
     * Mover categoría a un nuevo padre
     */
    public function moveTo(?int $newParentId): bool
    {
        // Prevenir referencias circulares
        if ($newParentId && $this->isAncestorOf($newParentId)) {
            return false;
        }

        return $this->update(['parent_id' => $newParentId]);
    }

    /**
     * Verificar si esta categoría es ancestro de la categoría dada
     */
    public function isAncestorOf(int $categoryId): bool
    {
        $descendants = $this->getAllDescendantIds();
        return in_array($categoryId, $descendants);
    }

    /**
     * Obtener todos los IDs de descendientes
     */
    public function getAllDescendantIds(): array
    {
        $ids = [];
        
        foreach ($this->children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $child->getAllDescendantIds());
        }

        return $ids;
    }

    /**
     * Obtener hermanos (categorías con el mismo padre)
     */
    public function getSiblings()
    {
        return static::where('parent_id', $this->parent_id)
            ->where('id', '!=', $this->id)
            ->get();
    }

    /**
     * Contar total de contratistas en esta categoría y subcategorías
     */
    public function getTotalContractorsCount(): int
    {
        $count = $this->contractors()->count();
        
        foreach ($this->children as $child) {
            $count += $child->getTotalContractorsCount();
        }

        return $count;
    }

    /**
     * Obtener el breadcrumb completo
     */
    public function getBreadcrumbs(): array
    {
        $breadcrumbs = [];
        $category = $this;

        while ($category) {
            array_unshift($breadcrumbs, [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug
            ]);
            $category = $category->parent;
        }

        return $breadcrumbs;
    }

    /**
     * Método estático para obtener el árbol completo de categorías
     */
    public static function getFullTree(): array
    {
        return static::whereNull('parent_id')
            ->with('children.children.children') // Hasta 3 niveles
            ->get()
            ->map(function ($category) {
                return $category->toTreeArray();
            })
            ->toArray();
    }

    /**
     * Eliminar categoría con sus subcategorías (cascade)
     */
    public function deleteWithChildren(): bool
    {
        // Eliminar primero las subcategorías
        foreach ($this->children as $child) {
            $child->deleteWithChildren();
        }

        // Luego eliminar esta categoría
        return $this->delete();
    }

    /**
     * Reorganizar subcategorías (cambiar orden)
     */
    public function reorderSubcategories(array $orderedIds): bool
    {
        foreach ($orderedIds as $index => $categoryId) {
            static::where('id', $categoryId)
                ->where('parent_id', $this->id)
                ->update(['sort_order' => $index + 1]);
        }

        return true;
    }
}