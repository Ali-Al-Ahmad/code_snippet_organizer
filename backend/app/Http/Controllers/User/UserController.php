<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function singleUserSnippets(Request $request)
    {
        try {
            $userSnippets = Auth::user()
                ->snippets()
                ->with('tags:name')
                ->get();

            return responseMessage(
                true,
                200,
                "Single user snippets",
                $userSnippets
            );

        } catch (\Throwable $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }


    public function userTags()
    {
        try {
            $tags = Auth::user()->snippets()
                ->with('tags')
                ->get()
                ->pluck('tags')
                ->flatten()
                ->pluck('name')
                ->unique()
                ->values();

            return responseMessage(
                true,
                200,
                "All User Tags",
                $tags
            );
        } catch (\Throwable $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }
}
