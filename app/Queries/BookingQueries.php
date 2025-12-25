<?php
// app/Queries/BookingQueries.php

namespace App\Queries;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class BookingQueries
{
    /**
     * Get user's bookings
     */
    public function forUser(User $user, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['activity.area', 'activity.category', 'availability'])
            ->where('user_id', $user->id)
            ->when($status, fn (Builder $q, $status) => 
                $q->where('status', $status)
            )
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * Get supplier's bookings for their activities
     */
    public function forSupplier(User $supplier, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['activity.area', 'user', 'availability'])
            ->whereHas('activity', fn (Builder $q) => 
                $q->where('supplier_id', $supplier->id)
            )
            ->when($status, fn (Builder $q, $status) => 
                $q->where('status', $status)
            )
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * Get upcoming bookings (confirmed, not yet completed)
     */
    public function upcoming(User $user, int $limit = 5): Collection
    {
        return Booking::query()
            ->with(['activity.area', 'availability'])
            ->where('user_id', $user->id)
            ->where('status', BookingStatus::Confirmed)
            ->where('booking_date', '>=', now()->toDateString())
            ->orderBy('booking_date')
            ->orderBy('booking_time')
            ->limit($limit)
            ->get();
    }

    /**
     * Get bookings for a specific date (for calendar view)
     */
    public function forDate(User $supplier, string $date): Collection
    {
        return Booking::query()
            ->with(['activity', 'user'])
            ->whereHas('activity', fn (Builder $q) => 
                $q->where('supplier_id', $supplier->id)
            )
            ->where('booking_date', $date)
            ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
            ->orderBy('booking_time')
            ->get();
    }

    /**
     * Find booking by reference number
     */
    public function findByReference(string $reference): ?Booking
    {
        return Booking::query()
            ->with(['activity.area', 'activity.category', 'activity.supplier', 'availability', 'payment'])
            ->where('reference', $reference)
            ->first();
    }

    /**
     * Get bookings stats for supplier dashboard
     */
    public function supplierStats(User $supplier): array
    {
        $baseQuery = Booking::query()
            ->whereHas('activity', fn (Builder $q) => 
                $q->where('supplier_id', $supplier->id)
            );
        
        return [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', BookingStatus::Pending)->count(),
            'confirmed' => (clone $baseQuery)->where('status', BookingStatus::Confirmed)->count(),
            'completed' => (clone $baseQuery)->where('status', BookingStatus::Completed)->count(),
            'cancelled' => (clone $baseQuery)->where('status', BookingStatus::Cancelled)->count(),
            'revenue' => (clone $baseQuery)
                ->whereIn('status', [BookingStatus::Confirmed, BookingStatus::Completed])
                ->sum('total_amount'),
        ];
    }

    /**
     * Get pending bookings that need confirmation
     */
    public function pendingForSupplier(User $supplier): Collection
    {
        return Booking::query()
            ->with(['activity', 'user', 'availability'])
            ->whereHas('activity', fn (Builder $q) => 
                $q->where('supplier_id', $supplier->id)
            )
            ->where('status', BookingStatus::Pending)
            ->orderBy('created_at')
            ->get();
    }
}
