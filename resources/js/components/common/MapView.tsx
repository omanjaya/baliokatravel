import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Static map image (no JavaScript required, most reliable)
interface StaticMapProps {
    lat: number;
    lng: number;
    width?: number;
    height?: number;
    zoom?: number;
    className?: string;
}

export function StaticMap({
    lat,
    lng,
    width = 600,
    height = 300,
    zoom = 15,
    className,
}: StaticMapProps) {
    // Using OpenStreetMap static image service
    const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red`;

    return (
        <div className={cn('rounded-xl overflow-hidden', className)}>
            <img
                src={url}
                alt="Map showing meeting point location"
                className="w-full h-auto object-cover"
                loading="lazy"
            />
        </div>
    );
}

// Full featured map with info card (uses static map + overlay)
interface MapViewProps {
    lat: number;
    lng: number;
    title?: string;
    address?: string;
    instructions?: string;
    zoom?: number;
    className?: string;
    showDirections?: boolean;
}

export function MapView({
    lat,
    lng,
    title = 'Meeting Point',
    address,
    instructions,
    zoom = 15,
    className,
    showDirections = true,
}: MapViewProps) {

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };

    const openInAppleMaps = () => {
        const url = `https://maps.apple.com/?daddr=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <div className={cn('rounded-xl overflow-hidden', className)}>
            {/* Static Map Image */}
            <StaticMap lat={lat} lng={lng} zoom={zoom} height={250} width={600} />

            {/* Info and Directions Overlay */}
            <div className="bg-white dark:bg-gray-800 p-4 border-t">
                <div className="flex items-start gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{title}</p>
                        {address && (
                            <p className="text-xs text-muted-foreground mt-0.5">{address}</p>
                        )}
                        {instructions && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                                {instructions}
                            </p>
                        )}
                    </div>
                </div>

                {showDirections && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={openInGoogleMaps}
                        >
                            <Navigation className="h-4 w-4 mr-1" />
                            Google Maps
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={openInAppleMaps}
                        >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Apple Maps
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
