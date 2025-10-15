# Backend Fix for Profession Delete Error

## Problem
Error 500 when deleting professions because table `contractors` doesn't exist.

## Error Details
```
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'gu.contractors' doesn't exist
```

## Solutions

### Option 1: Create Missing Tables
```bash
# Create contractors migration
php artisan make:migration create_contractors_table

# Create contractor_professions pivot table
php artisan make:migration create_contractor_professions_table

# Run migrations
php artisan migrate
```

### Option 2: Temporary Fix in Controller
In your `ProfessionController@destroy` method, comment out the contractor check:

```php
public function destroy(Profession $profession)
{
    // Temporarily comment this out until contractors table exists
    /*
    if ($profession->contractors()->exists()) {
        return response()->json([
            'message' => 'Cannot delete profession with associated contractors'
        ], 422);
    }
    */
    
    $profession->delete();
    
    return response()->json([
        'message' => 'Profession deleted successfully'
    ]);
}
```

### Option 3: Add Relationship Check
```php
// In Profession model, make the relationship optional
public function contractors()
{
    // Add check if table exists
    if (!Schema::hasTable('contractors')) {
        return collect();
    }
    
    return $this->belongsToMany(Contractor::class, 'contractor_professions');
}
```

## Recommended Solution
Create the missing tables with proper migrations to maintain database integrity.