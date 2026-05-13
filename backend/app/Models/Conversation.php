<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'bot_uid', 'session_id', 'role', 'message', 'taken_over', 'agent_id',
    ];

    protected $casts = [
        'taken_over' => 'boolean',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'session_id', 'session_id');
    }

    public function bot()
    {
        return $this->belongsTo(Bot::class, 'bot_uid', 'bot_uid');
    }
}
