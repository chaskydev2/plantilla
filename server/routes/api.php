
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
use App\Http\Controllers\Api\V1\ContractorController;
use App\Http\Controllers\Api\V1\DirectivityController;
use App\Http\Controllers\Api\V1\ProfessionController;
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
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\HomeownerProfileController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\Api\V1\JobPostController;
use App\Http\Controllers\Api\V1\JobContractController;
use App\Http\Controllers\Api\V1\JobApplicationController; 
use App\Http\Controllers\Api\V1\AttributeContractorController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\Api\V1\JobContractorController;
use App\Http\Controllers\Api\V1\ContractorTagController;
use App\Http\Controllers\Api\V1\ContractorTeamMemberController;
use App\Http\Controllers\Api\V1\ContractorMessageController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\AttributeHomeownerController;
use App\Http\Controllers\ReviewController;

use Illuminate\Support\Facades\Route;


Route::prefix('/v1')
    ->name('v1.')
    ->group(function () {
        // Rutas pública
       
        Route::get('trabajadores/near', [ContractorController::class, 'nearLocation']);
        Route::get('contractors/near', [ContractorController::class, 'nearLocation']);

        Route::post('login', [AuthController::class, 'login']);
        
        Route::get('services/first-fifteen', [ServiceController::class, 'firstFifteen']);
        Route::get('services/all', [ServiceController::class, 'all']);

        // Ruta pública para ver todas las publicaciones de job posts
        Route::get('job-posts/public', [JobPostController::class, 'publicIndex']);
        // Últimos 10 contratos de trabajo (API pública)
        Route::get('job-contracts/latest', [JobContractorController::class, 'latestTen']);
        
        Route::post('register/homeowner', [AuthController::class, 'registerHomeowner']);
        
        Route::post('register/contractor', [AuthController::class, 'registerContractor']);
        
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

        Route::get('tags/all', [TagController::class, 'all']);

        Route::get('professions/all', [ProfessionController::class, 'all']);

        Route::get('categories/all', [CategoryController::class, 'index']);
        Route::get('categories/tree', [CategoryController::class, 'tree']);
        Route::get('categories/roots', [CategoryController::class, 'roots']);
        Route::get('categories/search', [CategoryController::class, 'search']);

        Route::post('newsletters/send', [NewsletterController::class, 'send']);

                Route::get('contractors/{id}/full-info', [ContractorController::class, 'showFullInfo']);
                Route::get('contractors/advanced-search', [ContractorController::class, 'advancedSearch']);
                Route::get('contractors/{id}/near', [ContractorController::class, 'nearByContractor']);
                Route::get('trabajadores/advanced-search', [ContractorController::class, 'advancedSearch']);
                // Mensajes hacia contractors (chat/conversación)
                Route::get('contractors/{id}/messages', [ContractorMessageController::class, 'index']);
                Route::post('contractors/{id}/messages', [ContractorMessageController::class, 'store']);
        
              Route::post('reviews', [ReviewController::class, 'store']);
          
                 
         Route::middleware(['auth:api'])->group(function () {

         
            Route::apiResource('job-posts', JobPostController::class);

            Route::post('me', [AuthController::class, 'me']);

            Route::post('profile', [ProfileController::class, 'profile']);

            Route::post('logout', [AuthController::class, 'logout']);

            Route::put('profile/{id}', [ProfileController::class, 'update']);

            Route::put('profile/{id}/personal_information', [ProfileController::class, 'updatePersonalInformation']);

            Route::post('users/{id}/restore', [UserController::class, 'restore']);
            // Permanently remove a user

            // Permanently remove job application, contract, and post
            // Actualizar comentario de AttributeContractor
            Route::delete('job-applications/{id}/force', [JobApplicationController::class, 'forceDelete']);
            Route::delete('job-contracts/{id}/force', [JobContractController::class, 'forceDelete']);
            Route::delete('job-posts/{id}/force', [JobPostController::class, 'forceDelete']);


            // CRUD resource routes for jobs
            Route::apiResource('job-applications', JobApplicationController::class);
            Route::apiResource('job-contracts', JobContractController::class);
            Route::get('job-posts/homeowner/{homeowner}', [JobPostController::class, 'byHomeowner']);

           
            
            Route::delete('users/{id}/force', [UserController::class, 'forceDelete']);

            Route::get('users/all', [UserController::class, 'all']);

            Route::get('users/{id}/info', [UserController::class, 'getUserInformation']);
            
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

            Route::apiResource('tags', TagController::class);

            Route::apiResource('services', ServiceController::class);

            // Contractor tags
            Route::get('contractor-tags', [ContractorTagController::class, 'index']);
            Route::post('contractor-tags', [ContractorTagController::class, 'store']);
            Route::put('contractor-tags', [ContractorTagController::class, 'update']);
            Route::delete('contractor-tags', [ContractorTagController::class, 'destroy']);
            Route::get('contractors/{contractor}/tags', [ContractorTagController::class, 'tagsByContractor']);

            // Contractor teams
            Route::get('contractor-team-members', [ContractorTeamMemberController::class, 'index']);
            Route::post('contractor-team-members', [ContractorTeamMemberController::class, 'store']);
            Route::get('contractor-team-members/{leader}', [ContractorTeamMemberController::class, 'teamByLeader']);
            Route::get('contractor-team-members/member/{member}', [ContractorTeamMemberController::class, 'teamByMember']);
            Route::delete('contractor-team-members/{member}', [ContractorTeamMemberController::class, 'destroy']);
            
            Route::get('contractor-members-users', [ContractorTeamMemberController::class, 'indexByMember']);


            Route::apiResource('payment', PaymentController::class);

            // Contractor routes (también accesible como trabajadores)
            Route::get('contractors/stats', [ContractorController::class, 'stats']);
            Route::get('contractors/status/{status}', [ContractorController::class, 'byStatus']);
            Route::get('contractors/search-by-name', [ContractorController::class, 'searchByUserName']);
            Route::get('contractors/simple', [ContractorController::class, 'indexSimple']);
            Route::get('contractors/{contractor}/simple', [ContractorController::class, 'showSimple']);
           
            Route::patch('contractors/{contractor}/approve', [ContractorController::class, 'approve']);
            Route::patch('contractors/{contractor}/reject', [ContractorController::class, 'reject']);
            Route::patch('contractors/{contractor}/suspend', [ContractorController::class, 'suspend']);
            Route::apiResource('contractors', ContractorController::class);
            
            // Trabajadores routes (alias para contractors)
            Route::get('trabajadores/stats', [ContractorController::class, 'stats']);
            Route::get('trabajadores/status/{status}', [ContractorController::class, 'byStatus']);
            Route::get('trabajadores/simple', [ContractorController::class, 'indexSimple']);
            Route::get('trabajadores/{contractor}/simple', [ContractorController::class, 'showSimple']);
            Route::patch('trabajadores/{contractor}/approve', [ContractorController::class, 'approve']);
            Route::patch('trabajadores/{contractor}/reject', [ContractorController::class, 'reject']);
            Route::patch('trabajadores/{contractor}/suspend', [ContractorController::class, 'suspend']);
            Route::apiResource('trabajadores', ContractorController::class);

            // Profession routes
            Route::get('professions/available', [ProfessionController::class, 'available']);
            Route::get('professions/stats', [ProfessionController::class, 'stats']);
            Route::get('professions/popular', [ProfessionController::class, 'popular']);
            Route::get('professions/with-contractors', [ProfessionController::class, 'withContractorsInArea']);
            Route::get('professions/slug/{slug}', [ProfessionController::class, 'bySlug']);
            
            // Custom routes without model binding
            Route::get('professions', [ProfessionController::class, 'index']);
            Route::post('professions', [ProfessionController::class, 'store']);
            Route::get('professions/{id}', [ProfessionController::class, 'show']);
            Route::put('professions/{id}', [ProfessionController::class, 'update']);
            Route::patch('professions/{id}', [ProfessionController::class, 'update']);
            Route::delete('professions/{id}', [ProfessionController::class, 'destroy']);

            // Category routes
            Route::get('categories/{category}/ancestors', [CategoryController::class, 'ancestors']);
            Route::get('categories/{category}/descendants', [CategoryController::class, 'descendants']);
            Route::get('categories/{category}/breadcrumbs', [CategoryController::class, 'breadcrumbs']);
            Route::patch('categories/{category}/move', [CategoryController::class, 'move']);
            Route::patch('categories/{category}/move-to', [CategoryController::class, 'moveTo']);
            Route::post('categories/{category}/subcategories', [CategoryController::class, 'addSubcategories']);
            Route::delete('categories/{category}/with-children', [CategoryController::class, 'destroyWithChildren']);
            Route::apiResource('categories', CategoryController::class);

            // Attribute routes
            Route::get('attributes/for-contractors', [AttributeController::class, 'forContractors']);
            Route::get('attributes/for-homeowners', [AttributeController::class, 'forHomeowners']);
            Route::get('attributes/statistics', [AttributeController::class, 'statistics']);
            Route::apiResource('attributes', AttributeController::class);

            // Homeowner Profile routes
            Route::get('homeowner-profiles/all', [HomeownerProfileController::class, 'all']);
            Route::get('homeowner-profiles/stats', [HomeownerProfileController::class, 'stats']);
            Route::apiResource('homeowner-profiles', HomeownerProfileController::class);
        
            Route::get('attribute-contractors', [AttributeContractorController::class, 'index']);
            Route::post('attribute-contractors', [AttributeContractorController::class, 'store']);
            Route::get('attribute-contractors/by-contractor/{contractor_id}', [AttributeContractorController::class, 'byContractor']);
            
            Route::get('attribute-contractors/by-user/{userId}', [AttributeContractorController::class, 'byUser']);
        
            Route::patch('attribute-contractors/{id}/status', [AttributeContractorController::class, 'updateStatus']);
            
            Route::patch('attribute-contractors/{id}/comentario', [AttributeContractorController::class, 'updateComentario']);                
            
            Route::patch('users/{id}/edit-profile', [UserController::class, 'updateEditProfileStatus']);
            Route::patch('users/{id}/verification', [UserController::class, 'updateVerificationStatus']);
     
            Route::put('contractors/{id}/update-all', [ContractorController::class, 'updateAllFields']);

            Route::post('attribute-contractors/{id}/update-document', [AttributeContractorController::class, 'updateDocument']);

            Route::get('attribute-homeowners', [AttributeHomeownerController::class, 'index']);
            Route::post('attribute-homeowners', [AttributeHomeownerController::class, 'store']);
            Route::get('attribute-homeowners/by-homeowner/{homeowner_id}', [AttributeHomeownerController::class, 'byHomeowner']);
            Route::get('attribute-homeowners/by-user/{userId}', [AttributeHomeownerController::class, 'byUser']);
            Route::patch('attribute-homeowners/{id}/status', [AttributeHomeownerController::class, 'updateStatus']);
            Route::patch('attribute-homeowners/{id}/comentario', [AttributeHomeownerController::class, 'updateComentario']);
            Route::post('attribute-homeowners/{id}/update-document', [AttributeHomeownerController::class, 'updateDocument']);

            // Jobs CRUD routes
            Route::get('jobs-creator', [JobContractorController::class, 'index']);
            Route::post('jobs-creator', [JobContractorController::class, 'store']);
            Route::get('jobs-creator/{id}', [JobContractorController::class, 'show']);
            Route::post('jobs-creator/{id}', [JobContractorController::class, 'update']);
            Route::delete('jobs-creator/{id}', [JobContractorController::class, 'destroy']);
            Route::patch('jobs-creator/{id}/status', [JobContractorController::class, 'updateStatus']);
            Route::get('jobs-creator/creator/{creatorId}', [JobContractorController::class, 'jobsByCreator']);
            Route::get('jobs-creator/homeowner/{homeownerId}', [JobContractorController::class, 'jobsByHomeowner']);
            Route::get('jobs-creator/statistics', [JobContractorController::class, 'statistics']);
             
            
            // Ruta para eliminar uno o varios job posts
            Route::delete('job-posts/destroy-many', [JobPostController::class, 'destroyMany']);
            // Cambiar status_aprobation de un JobPost
            Route::post('job-posts/{id}/aprobation', [JobPostController::class, 'changeAprobationStatus']); 
            Route::patch('jobs/{id}/activate', [JobController::class, 'activate']);
            Route::apiResource('jobs', JobController::class);
        
        });
    
    });
