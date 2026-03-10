<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseServerController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UnitController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Google OAuth
Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Public invitation routes (can be accessed before login)
Route::get('/invitations/{token}', [InvitationController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Course Servers
    Route::get('/course-servers', [CourseServerController::class, 'index']);
    Route::post('/course-servers', [CourseServerController::class, 'store']);
    Route::get('/course-servers/{courseServer}', [CourseServerController::class, 'show']);
    Route::put('/course-servers/{courseServer}', [CourseServerController::class, 'update']);
    Route::post('/course-servers/join', [CourseServerController::class, 'join']);
    Route::delete('/course-servers/{courseServer}/leave', [CourseServerController::class, 'leave']);

    // Units
    Route::get('/units', [UnitController::class, 'index']);
    Route::post('/course-servers/{courseServer}/units', [UnitController::class, 'store']);
    Route::get('/units/{unit}', [UnitController::class, 'show']);
    Route::put('/units/{unit}', [UnitController::class, 'update']);
    Route::delete('/units/{unit}', [UnitController::class, 'destroy']);

    // Documents
    Route::get('/units/{unit}/documents', [DocumentController::class, 'index']);
    Route::post('/units/{unit}/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    // Messages (Chat)
    Route::get('/units/{unit}/messages', [MessageController::class, 'index']);
    Route::post('/units/{unit}/messages', [MessageController::class, 'store']);
    Route::put('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

    // Invitations
    Route::get('/invitations', [InvitationController::class, 'index']);
    Route::post('/units/{unit}/invitations', [InvitationController::class, 'store']);
    Route::post('/invitations/{token}/accept', [InvitationController::class, 'accept']);
    Route::post('/invitations/{token}/reject', [InvitationController::class, 'reject']);

    // Groups (Assignment Grouping)
    Route::get('/units/{unit}/groups', [GroupController::class, 'index']);
    Route::post('/units/{unit}/groups/auto-setup', [GroupController::class, 'autoSetup']);
    Route::delete('/units/{unit}/groups', [GroupController::class, 'destroyAll']);
    Route::get('/groups/{group}', [GroupController::class, 'show']);
    Route::put('/groups/{group}', [GroupController::class, 'update']);
    Route::post('/groups/{group}/join', [GroupController::class, 'join']);
    Route::delete('/groups/{group}/leave', [GroupController::class, 'leave']);
});
