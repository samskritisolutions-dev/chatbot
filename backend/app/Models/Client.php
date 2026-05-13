<?php
// app/Models/Client.php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'clients';

    protected $fillable = ['name', 'email', 'password', 'plan', 'is_active', 'is_admin'];

    protected $hidden = ['password'];

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function bots()
    {
        return $this->hasMany(Bot::class, 'client_id', 'id');
    }
}
