<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'bot_uid',
        'session_id',
        'name',
        'email',
        'phone',
    ];
}
