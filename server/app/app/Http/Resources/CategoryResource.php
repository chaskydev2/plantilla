<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
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
            'is_parent' => $this->isParent(),
            'is_child' => $this->isChild(),
            'has_children' => $this->hasChildren(),
            
            // Relationships
            'parent' => $this->whenLoaded('parent', function () {
                return new CategoryResource($this->parent);
            }),
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'all_children' => CategoryResource::collection($this->whenLoaded('allChildren')),
            'contractors' => ContractorResource::collection($this->whenLoaded('contractors')),
            'professions' => ProfessionResource::collection($this->whenLoaded('professions')),
            
            // Counts
            'children_count' => $this->when(
                $this->relationLoaded('children') || isset($this->children_count),
                fn() => $this->children_count ?? $this->children->count()
            ),
            'contractors_count' => $this->when(
                $this->relationLoaded('contractors') || isset($this->contractors_count),
                fn() => $this->contractors_count ?? $this->contractors->count()
            ),
            'professions_count' => $this->when(
                $this->relationLoaded('professions') || isset($this->professions_count),
                fn() => $this->professions_count ?? $this->professions->count()
            ),
            
            'timestamps' => [
                'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            ],
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'can_be_deleted' => $this->canBeDeleted(),
            ],
        ];
    }
}