<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    public const MEMBER_TITLE = 'user';

    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'phone',
        'password',
        'title',
        'added_by',
        'updated_by',
        'email_verified_at',
    ];

    protected $appends = ['name'];

    public function getNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function isStaff(): bool
    {
        return $this->title !== null && $this->title !== self::MEMBER_TITLE;
    }

    public function isSystemAdmin(): bool
    {
        return $this->title === 'Sistem Yöneticisi';
    }

    public function scopeStaff($query)
    {
        return $query->where('title', '!=', self::MEMBER_TITLE)
            ->whereNotNull('title');
    }

    public function scopeMembers($query)
    {
        return $query->where('title', self::MEMBER_TITLE);
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
