<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtworkComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'artwork_id',
        'user_id',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
