<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
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
            'required_for' => $this->required_for,
            'required_for_text' => $this->getRequiredForText(),
            'contractors_count' => $this->whenCounted('contractors'),
            'homeowners_count' => $this->whenCounted('homeowners'),
            'total_usage_count' => $this->whenAppended('total_usage_count'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Relaciones opcionales
            'contractors' => $this->whenLoaded('contractors', function () {
                return $this->contractors->map(function ($contractor) {
                    return [
                        'id' => $contractor->id,
                        'name' => $contractor->name,
                        'email' => $contractor->email,
                        'value' => $contractor->pivot->value ?? null,
                        'assigned_at' => $contractor->pivot->created_at?->format('Y-m-d H:i:s'),
                    ];
                });
            }),
            
            'homeowners' => $this->whenLoaded('homeowners', function () {
                return $this->homeowners->map(function ($homeowner) {
                    return [
                        'id' => $homeowner->id,
                        'name' => $homeowner->name,
                        'email' => $homeowner->email,
                        'value' => $homeowner->pivot->value ?? null,
                        'assigned_at' => $homeowner->pivot->created_at?->format('Y-m-d H:i:s'),
                    ];
                });
            }),
        ];
    }

    /**
     * Get the required_for field as readable text.
     */
    private function getRequiredForText(): string
    {
        return match($this->required_for) {
            'contractor' => 'Solo Contratistas',
            'homeowner' => 'Solo Propietarios',
            'both' => 'Ambos',
            default => 'No especificado'
        };
    }
}