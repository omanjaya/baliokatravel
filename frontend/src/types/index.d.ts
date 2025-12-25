export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'traveler' | 'supplier' | 'admin';
    avatar?: string;
    phone?: string;
    business_name?: string;
    business_license?: string;
}

export interface BaliArea {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    popular_for?: string[];
}

export interface Category {
    id: string;
    name: string;
    icon?: string;
    image_url?: string;
}

export interface Activity {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    area: BaliArea;
    category: Category;
    supplier: User;
    duration_minutes: number;
    min_group_size?: number;
    max_group_size: number;
    min_age?: number;
    price_idr: number;
    price_usd?: number;
    child_price_idr?: number;
    cover_image?: string;
    images?: string[];
    video_url?: string;
    highlights?: string[];
    included?: string[];
    excluded?: string[];
    languages?: string[];
    difficulty: 'easy' | 'moderate' | 'challenging';
    rating_average: number;
    review_count: number;
    is_featured: boolean;
    instant_booking?: boolean;
    cancellation_policy?: 'flexible' | 'moderate' | 'strict';
    meeting_point?: string;
    meeting_point_lat?: number;
    meeting_point_lng?: number;
    meeting_point_instructions?: string;
}

export interface Availability {
    id: string;
    date: string;
    start_time: string;
    available_spots: number;
    status: 'open' | 'full' | 'cancelled';
}

export interface Booking {
    id: string;
    reference: string;
    activity: Activity;
    availability?: Availability;
    payment?: Payment;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    participants: { adults: number; children: number };
    total_participants: number;
    subtotal: number;
    service_fee: number;
    total_amount: number;
    currency: string;
    booking_date?: string;
    booking_time?: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
    special_requests?: string;
    created_at: string;
    confirmed_at?: string;
    cancelled_at?: string;
}

export interface Payment {
    id: string;
    booking_id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    paid_at?: string;
}

export interface Review {
    id: string;
    activity_id: string;
    booking_id?: string;
    user_id: string;
    user?: User;
    rating: number;
    title?: string;
    content: string;
    photos?: string[];
    supplier_response?: string;
    supplier_responded_at?: string;
    status: 'pending' | 'published' | 'hidden';
    helpful_count: number;
    created_at: string;
}

export type PageProps<T = {}> = T & {
    auth: { user: User };
    flash: { success?: string; error?: string };
};
