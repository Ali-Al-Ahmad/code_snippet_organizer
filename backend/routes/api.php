<?php

use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Snippet\SnippetController;

Route::group(["prefix" => "v0.1"], function () {



    Route::group(["prefix" => "auth"], function () {
        Route::post('/signup', action: [AuthController::class, "signup"]);
        Route::post('/login', [AuthController::class, "login"]);
        Route::get("/userSnippets", [UserController::class, "singleUserSnippets"]);
        Route::get("/userTags", [UserController::class, "userTags"]);

    });


    Route::group(["middleware" => "auth:api"], function () {
        Route::group(["prefix" => "snippets"], function () {
            Route::get("/allsnippets/{id?}", [SnippetController::class, "all"]);
            Route::post("/addsnippet", [SnippetController::class, "addSnippet"]);
            Route::delete("/deletesnippet/{id}", [SnippetController::class, "deleteSnippet"]);
            Route::post("/editsnippet", [SnippetController::class, "editSnippet"]);
        });
    });
});
