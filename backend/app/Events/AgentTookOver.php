<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AgentTookOver implements ShouldBroadcast
{
    public function __construct(
        public string $sessionId,
        public string $agentName
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('chat.' . $this->sessionId);
    }

    public function broadcastAs(): string
    {
        return 'agent-takeover';
    }
}
