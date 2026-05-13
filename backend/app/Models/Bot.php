<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bot extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id', 'bot_uid', 'bot_name', 'avatar_url', 'logo_url',
        'system_prompt', 'welcome_msg', 'fallback_msg',
        'widget_color', 'font_family', 'position', 'allowed_domains', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'bot_uid', 'bot_uid');
    }
}
