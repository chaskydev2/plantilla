<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\JobPost;

class JobPostStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_job_post_with_minimal_data()
    {
        $data = [
            'homeowner_id' => 24,
            'service_id' => 1,
            'title' => 'lkjhcx',
            'description' => 'mlknbhgcfx',
            'deadline' => '2001-08-01',
            'status' => null,
            'price' => 88,
            'currency' => 'bd',
            'address_line1' => '108 Calle Procuraduría General de Justicia',
            'address_line2' => 'Federal',
            'city' => 'Ciudad de México',
            'state_code' => 'CDMX',
            'postal_code' => '15700',
            'lat' => 19,
            'lng' => -99,
            // 'image' => null, // No image sent
        ];

        $response = $this->postJson('/api/v1/job-posts', $data);
        if ($response->status() !== 201) {
            fwrite(STDERR, $response->getContent() . "\n");
        }
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'title',
                'description',
                'price',
                'currency',
                'address_line1',
                'address_line2',
                'city',
                'state_code',
                'postal_code',
                'lat',
                'lng',
                'image_path',
                // ...otros campos relevantes
            ]
        ]);

        $this->assertDatabaseHas('job_posts', [
            'homeowner_id' => 24,
            'service_id' => 1,
            'title' => 'lkjhcx',
            'description' => 'mlknbhgcfx',
            'currency' => 'bd',
        ]);
    }
}
