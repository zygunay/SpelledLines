<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActionLog extends Model
{
    protected $fillable = ['admin_name', 'target_name','target_email', // Eklendi
        'target_title', 'action', 'reason'];
}