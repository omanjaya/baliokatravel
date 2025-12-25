import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Star,
    ArrowLeft,
    MapPin,
    Upload,
    X,
    Loader2
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { Activity, Booking } from '@/types';
import { useState } from 'react';

interface Props {
    activity: Activity;
    booking: Booking | null;
}

export default function CreateReview({ activity, booking }: Props) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        rating: 0,
        title: '',
        content: '',
        booking_id: booking?.id || '',
        photos: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('rating', String(data.rating));
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.booking_id) {
            formData.append('booking_id', data.booking_id);
        }
        data.photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo);
        });

        post(`/activities/${activity.id}/reviews`, {
            forceFormData: true,
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + data.photos.length > 5) {
            alert('You can upload up to 5 photos');
            return;
        }

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewPhotos(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setData('photos', [...data.photos, ...files]);
    };

    const removePhoto = (index: number) => {
        setData('photos', data.photos.filter((_, i) => i !== index));
        setPreviewPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const getRatingLabel = (rating: number) => {
        switch (rating) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return 'Select rating';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Review ${activity.title}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container max-w-2xl">
                    <Link
                        href={`/activities/${activity.slug}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Activity
                    </Link>

                    <Card>
                        <CardHeader>
                            <CardTitle>Write a Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Activity Preview */}
                            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                                <img
                                    src={activity.cover_image || '/images/placeholder.jpg'}
                                    alt={activity.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="font-semibold">{activity.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {activity.area?.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatDuration(activity.duration_minutes)}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Rating */}
                                <div className="space-y-2">
                                    <Label>Your Rating *</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setData('rating', star)}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    className="p-1 focus:outline-none"
                                                    aria-label={`Rate ${star} stars`}
                                                >
                                                    <Star
                                                        className={`h-8 w-8 transition ${star <= (hoveredRating || data.rating)
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {getRatingLabel(hoveredRating || data.rating)}
                                        </span>
                                    </div>
                                    {errors.rating && (
                                        <p className="text-sm text-red-600">{errors.rating}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Review Title (Optional)</Label>
                                    <Input
                                        id="title"
                                        placeholder="Sum up your experience in a few words"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        maxLength={100}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Your Review *</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Share your experience with other travelers. What did you enjoy? What could be improved?"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={6}
                                        maxLength={2000}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Minimum 20 characters</span>
                                        <span>{data.content.length}/2000</span>
                                    </div>
                                    {errors.content && (
                                        <p className="text-sm text-red-600">{errors.content}</p>
                                    )}
                                </div>

                                {/* Photos */}
                                <div className="space-y-2">
                                    <Label>Photos (Optional)</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Share photos from your experience (up to 5 photos, max 5MB each)
                                    </p>

                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {previewPhotos.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                                                    aria-label="Remove photo"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}

                                        {data.photos.length < 5 && (
                                            <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition">
                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                    multiple
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-4">
                                    <Link href={`/activities/${activity.slug}`} className="flex-1">
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={processing || data.rating === 0 || data.content.length < 20}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
