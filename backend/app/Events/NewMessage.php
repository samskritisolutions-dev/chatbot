<?php
// app/Events/NewMessage.php
namespace App\Events;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewMessage implements ShouldBroadcast
{
    public function __construct(
        public string $botUid,
        public string $sessionId,
        public string $role,
        public string $message
    ) {}

    public function broadcastOn(): Channel
    {
        // Dashboard listens on bot channel; widget listens on session channel
        return new Channel('chat.' . $this->sessionId);
    }

    public function broadcastAs(): string
    {
        return 'new-message';
    }
}
