<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\JobPost;
use App\Models\HomeownerProfile;

class JobPostImageUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_post_image_upload()
    {
        // Crear un usuario homeowner de prueba
        $homeowner = HomeownerProfile::factory()->create();

        // Simular almacenamiento
        Storage::fake('public');

        $data = [
            'homeowner_id' => $homeowner->user_id,
            'title' => 'Test Job',
            'description' => 'Test description',
            'image' => UploadedFile::fake()->image('test.jpg'),
        ];

        $response = $this->postJson('/api/v1/job-posts', $data);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'title',
                'description',
                'image_path',
            ]
        ]);

        // Verifica que la imagen se haya guardado en public/assets/job-posts
        $jobPost = JobPost::first();
        $this->assertNotNull($jobPost->image_path);
        $fullPath = public_path($jobPost->image_path);
        $this->assertFileExists($fullPath);
    }
}
