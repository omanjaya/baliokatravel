import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
    images: string[];
    title?: string;
    videoUrl?: string;
    className?: string;
}

export function ImageGallery({
    images,
    title = 'Gallery',
    videoUrl,
    className,
}: ImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const allMedia = videoUrl ? [videoUrl, ...images] : images;
    const displayImages = images.slice(0, 5);
    const remainingCount = images.length - 5;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
    };

    const isVideo = (url: string) => {
        return url.includes('youtube') || url.includes('vimeo') || url.endsWith('.mp4');
    };

    if (images.length === 0) {
        return (
            <div className={cn('aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center', className)}>
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className={cn('grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden', className)}>
                {/* Main Image */}
                <button
                    onClick={() => {
                        setCurrentIndex(videoUrl ? 1 : 0);
                        setLightboxOpen(true);
                    }}
                    className="col-span-2 row-span-2 relative group"
                >
                    <img
                        src={displayImages[0]}
                        alt={`${title} - 1`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>

                {/* Video Thumbnail */}
                {videoUrl && (
                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setLightboxOpen(true);
                        }}
                        className="relative group"
                    >
                        <img
                            src={displayImages[1] || displayImages[0]}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="h-5 w-5 text-gray-900 ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </button>
                )}

                {/* Other Images */}
                {displayImages.slice(videoUrl ? 1 : 1, 5).map((image, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentIndex(videoUrl ? index + 2 : index + 1);
                            setLightboxOpen(true);
                        }}
                        className="relative group"
                    >
                        <img
                            src={image}
                            alt={`${title} - ${index + 2}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Remaining Count Overlay */}
                        {index === 3 && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    +{remainingCount} more
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-5xl w-full bg-black/95 border-0 p-0">
                    <div className="relative">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        {/* Navigation */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>

                        {/* Main Content */}
                        <div className="flex items-center justify-center min-h-[60vh] p-8">
                            {isVideo(allMedia[currentIndex]) ? (
                                <div className="w-full aspect-video">
                                    <iframe
                                        src={allMedia[currentIndex].replace('watch?v=', 'embed/')}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full rounded-lg"
                                        title={`${title} - Video`}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={allMedia[currentIndex]}
                                    alt={`${title} - ${currentIndex + 1}`}
                                    className="max-h-[70vh] max-w-full object-contain rounded-lg"
                                />
                            )}
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                            {currentIndex + 1} / {allMedia.length}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex justify-center gap-2 pb-6 px-4 overflow-x-auto">
                            {allMedia.map((media, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={cn(
                                        'w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                                        currentIndex === index
                                            ? 'border-white'
                                            : 'border-transparent opacity-50 hover:opacity-75'
                                    )}
                                >
                                    {isVideo(media) ? (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <Play className="h-4 w-4 text-white" />
                                        </div>
                                    ) : (
                                        <img
                                            src={media}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
