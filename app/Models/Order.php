<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'first_name', 'last_name', 'email', 'phone',
        'material', 'size', 'offered_price', 'agreed_price',
        'subject', 'details', 'status', 'updated_by'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function actionLogs()
    {
        return $this->hasMany(OrderActionLog::class);
    }
}