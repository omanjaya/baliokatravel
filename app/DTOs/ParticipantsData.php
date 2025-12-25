<?php
// app/DTOs/ParticipantsData.php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class ParticipantsData
{
    public function __construct(
        public int $adults,
        public int $children = 0,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            adults: (int) $request->input('adults', 1),
            children: (int) $request->input('children', 0),
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            adults: (int) ($data['adults'] ?? 1),
            children: (int) ($data['children'] ?? 0),
        );
    }

    public function total(): int
    {
        return $this->adults + $this->children;
    }

    public function toArray(): array
    {
        return [
            'adults' => $this->adults,
            'children' => $this->children,
        ];
    }
}
