<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Tag extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    protected $hidden = ['pivot'];


    public function snippet()
    {
        return $this->belongsToMany(Snippet::class, 'snippet_tag');
    }
}
