<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderActionLog extends Model
{
    protected $fillable = [
        'order_id',
        'admin_name',
        'customer_name',
        'customer_email',
        'action',
        'details',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
