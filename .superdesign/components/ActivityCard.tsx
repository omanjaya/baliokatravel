import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';

interface ActivityCardProps {
    id: number;
    title: string;
    category: string;
    categoryColor: string;
    price: number;
    priceIdr: number;
    rating: number;
    location: string;
    image: string;
    description: string;
    staggerDelay?: number;
}

export default function ActivityCard({
    id,
    title,
    category,
    categoryColor,
    price,
    priceIdr,
    rating,
    location,
    image,
    description,
    staggerDelay = 0
}: ActivityCardProps) {
    return (
        <div className={`glass-card rounded-3xl overflow-hidden group animate-fade-in-up`} style={{animationDelay: `${staggerDelay}s`}}>
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 w-10 h-10 glass-strong rounded-full flex items-center justify-center heart-icon">
                    <Heart className="w-5 h-5 text-foreground" />
                </button>
                {/* Price Badge */}
                <div className="price-badge absolute bottom-4 left-4 px-4 py-2 rounded-full">
                    <p className="text-foreground font-bold">${price} USD</p>
                    <p className="text-foreground text-xs opacity-70">Rp {priceIdr.toLocaleString('id-ID')}</p>
                </div>
            </div>
            {/* Card Content */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className={`bg-${categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                        {category}
                    </span>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-sunset-gold fill-sunset-gold" />
                        <span className="text-foreground font-semibold">{rating}</span>
                    </div>
                </div>
                <h3 className="text-foreground font-bold text-xl mb-2">{title}</h3>
                <p className="text-foreground opacity-70 text-sm mb-4">{description}</p>
                <div className="flex items-center text-foreground opacity-60 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{location}</span>
                </div>
                <button className="w-full btn-primary py-3 rounded-xl text-white font-semibold ripple">
                    Book Now
                </button>
            </div>
        </div>
    );
}