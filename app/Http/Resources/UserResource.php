<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'role' => $this->role,
            'avatar' => $this->avatar,
            'phone' => $this->phone,
            'business_name' => $this->when($this->role === 'supplier', $this->business_name),
        ];
    }
}
