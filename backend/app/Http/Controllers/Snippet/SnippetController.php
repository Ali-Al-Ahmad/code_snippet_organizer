<?php

namespace App\Http\Controllers\Snippet;

use App\Models\Snippet;
use App\Models\Tag;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class SnippetController extends Controller
{
    public function all(Request $request)
    {

        try {
            if ($request["id"]) {
                $snippet = Snippet::find($request["id"]);
                if (!$snippet) {
                    return responseMessage(false, 401, "Not Found");
                }
                return responseMessage(
                    true,
                    200,
                    "Snippet Found",
                    $snippet
                );
            } else {
                return responseMessage(
                    true,
                    200,
                    "All Snippets",
                    Snippet::all()
                );
            }
        } catch (\Exception $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }

    public function addSnippet(Request $request)
    {
        try {
            $request->validate([
                'content' => 'required|string|min:2',
                'language' => 'required|string|min:1',
                'keywords' => 'required|string|min:1',
            ]);

            $snippet = new Snippet();
            $snippet->user_id = Auth::id();
            $snippet->content = $request["content"];
            $snippet->language = $request["language"];
            $snippet->keywords = $request["keywords"];


            $snippet->save();
            $tags = collect($request["tags"])->map(fn($tag) => Tag::firstOrCreate(['name' => $tag])->id);

            $snippet->tags()->attach($tags);

            return responseMessage(
                true,
                201,
                "Snippet Added Successfully"
            );
        } catch (\Throwable $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }

    public function editSnippet(Request $request)
    {
        try {
            $snippet = Snippet::find($request["id"]);

            if (!$snippet) {
                return responseMessage(
                    false,
                    401,
                    "Snippet Not Found"
                );
            }

            //check if user who Created the snippet is same user trying to Edit
            $userId = Auth::id();
            $snippet = Snippet::find($request["id"]);

            if ($snippet->user_id !== $userId) {
                return responseMessage(
                    false,
                    401,
                    "You are not allowed to delete"
                );
            }

            $snippet->content = $request["content"] ?? $snippet->content;
            $snippet->language = $request["language"] ?? $snippet->language;
            $snippet->keywords = $request["keywords"] ?? $snippet->keywords;
            $snippet->isFavorite = filter_var($request->input('isFavorite'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            $snippet->save();

            $tags = collect($request["tags"])->map(fn($tag) => Tag::firstOrCreate(['name' => $tag])->id);

            $snippet->tags()->sync($tags);


            return responseMessage(
                true,
                200,
                "Snippet updated Successfully",
                $snippet->load("tags")
            );
        } catch (\Throwable $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }

    public function deleteSnippet(Request $request)
    {
        try {
            //check if user who Created the snippet is same user trying to delete
            $userId = Auth::id();
            $snippet = Snippet::find($request["id"]);

            if ($snippet->user_id !== $userId) {
                return responseMessage(
                    false,
                    401,
                    "You are not allowed to delete"
                );
            }
            $snippet->delete();
            return responseMessage(
                true,
                200,
                "Snippet deleted Successfully"
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
