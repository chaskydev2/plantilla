<?php

use App\Http\Controllers\Api\V1\AnnouncementController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\Auth\AcademicTrainingController;
use App\Http\Controllers\Api\V1\Auth\TechnicalSkillController;
use App\Http\Controllers\Api\V1\Auth\WorkExperienceController;
use App\Http\Controllers\Api\V1\Auth\WorkReferenceController;
use App\Http\Controllers\Api\V1\BeginningController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\DirectivityController;
use App\Http\Controllers\Api\V1\MoralValueController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\EventTypeController;
use App\Http\Controllers\Api\V1\HistoryController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\RequirementController;
use App\Http\Controllers\Api\V1\AgreementController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\FaqController;
use App\Http\Controllers\Api\V1\BannerController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\SocialNetworkController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\RolePermissionController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\UserRoleController;
use Illuminate\Support\Facades\Route;

Route::prefix('/v1')
    ->name('v1.')
    ->group(function () {

        Route::post('login', [AuthController::class, 'login']);
        
        Route::get('agreements/all', [AgreementController::class, 'all']);

        Route::get('announcements/all', [AnnouncementController::class, 'all']); 

        Route::get('banners/all', [BannerController::class, 'all']);

        Route::get('beginnings/all', [BeginningController::class, 'all']);

        Route::get('contacts/all', [ContactController::class, 'all']);

        Route::get('courses/all', [CourseController::class, 'all']);

        Route::get('directivities/all', [DirectivityController::class, 'all']);

        Route::get('events/all', [EventController::class, 'all']);

        Route::get('faqs/all', [FaqController::class, 'all']);

        Route::get('histories/all', [HistoryController::class, 'all']);

        Route::get('moral_values/all', [MoralValueController::class, 'all']);

        Route::get('requirements/all', [RequirementController::class, 'all']);

        Route::get('social_networks/all', [SocialNetworkController::class, 'all']);

        Route::post('newsletters/send', [NewsletterController::class, 'send']);

        Route::middleware(['auth:api'])->group(function () {
            Route::post('me', [AuthController::class, 'me']);

            Route::post('profile', [ProfileController::class, 'profile']);

            Route::post('logout', [AuthController::class, 'logout']);

            Route::put('profile/{id}', [ProfileController::class, 'update']);

            Route::put('profile/{id}/personal_information', [ProfileController::class, 'updatePersonalInformation']);

            Route::post('users/{id}/restore', [UserController::class, 'restore']);

            Route::get('users/all', [UserController::class, 'all']);

            Route::apiResource('users', UserController::class);

            Route::apiResource('users.academictrainings', AcademicTrainingController::class);

            Route::apiResource('users.workexperiences', WorkExperienceController::class);

            Route::apiResource('users.workreferences', WorkReferenceController::class);

            Route::apiResource('users.technicalskills', TechnicalSkillController::class);

            Route::get('roles/all', [RoleController::class, 'all']);
            Route::apiResource('roles', RoleController::class);

            Route::get('permissions/all', [PermissionController::class, 'all']);
            Route::apiResource('permissions', PermissionController::class)->only(['index', 'show']);

            Route::prefix('roles/{role}/permissions')->group(function () {
                Route::get('/', [RolePermissionController::class, 'rolePermissions']);
                Route::post('/sync', [RolePermissionController::class, 'syncPermissions']);
            });

            Route::prefix('users/{user}/roles')->group(function () {
                Route::get('/', [UserRoleController::class, 'userRoles']);
                Route::post('/sync', [UserRoleController::class, 'syncRoles']);
            });

            Route::apiResource('event_types', EventTypeController::class);

            Route::apiResource('events', EventController::class);

            Route::apiResource('announcements', AnnouncementController::class);

            Route::apiResource('courses', CourseController::class);

            //web
            Route::apiResource('histories', HistoryController::class);

            Route::apiResource('contacts', ContactController::class);

            Route::apiResource('beginnings', BeginningController::class);

            Route::apiResource('moral_values', MoralValueController::class); 

            Route::apiResource('directivities', DirectivityController::class); 

            Route::apiResource('requirements', RequirementController::class); 

            Route::apiResource('agreements', AgreementController::class);

            Route::apiResource('newsletters', NewsletterController::class);

            Route::apiResource('faqs', faqController::class);

            Route::apiResource('banners', BannerController::class);  

            Route::apiResource('social_networks', SocialNetworkController::class);

            Route::apiResource('payment', PaymentController::class); 
        });
    });
