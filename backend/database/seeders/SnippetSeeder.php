<?php

namespace Database\Seeders;
use App\Models\Snippet;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SnippetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Snippet::factory()->count(2)->create();
    }
}
