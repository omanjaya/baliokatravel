import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, MapPin, Calendar, Users, ChevronDown, Star, Heart, 
    ShieldCheck, Users as UsersIcon, Headphones, Waves, Mountain, 
    Landmark, Utensils, Sparkles, Map, Ship, Sunset 
} from 'lucide-react';
import MainLayout from './MainLayout';

export default function Home() {
    const [activeTab, setActiveTab] = useState('Stays');

    const tabs = ['Stays', 'Experiences', 'Packages'];

    const featuredActivities = [
        {
            id: 1,
            title: 'Surfing Lesson',
            category: 'Water Sports',
            categoryColor: 'ocean-blue',
            price: 45,
            priceIdr: 675000,
            rating: 4.8,
            location: 'Canggu',
            image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
            id: 2,
            title: 'Sacred Temple Tour',
            category: 'Culture',
            categoryColor: 'jungle-green',
            price: 65,
            priceIdr: 975000,
            rating: 4.9,
            location: 'Ubud',
            image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
            id: 3,
            title: 'Nusa Penida Snorkeling',
            category: 'Island Hopping',
            categoryColor: 'sunset-gold',
            price: 55,
            priceIdr: 825000,
            rating: 5.0,
            location: 'Nusa Penida',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        },
        {
            id: 4,
            title: 'Jimbaran Beach Dinner',
            category: 'Sunset Experience',
            categoryColor: 'coral',
            price: 85,
            priceIdr: 1275000,
            rating: 4.9,
            location: 'Jimbaran',
            image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }
    ];

    const categories = [
        { name: 'Water Sports', icon: Waves, color: 'ocean-blue', description: 'Surfing, Diving & More' },
        { name: 'Adventure', icon: Mountain, color: 'jungle-green', description: 'Hiking, Rafting & More' },
        { name: 'Culture', icon: Landmark, color: 'sunset-gold', description: 'Temples & Heritage' },
        { name: 'Culinary', icon: Utensils, color: 'coral', description: 'Food Tours & Classes' },
        { name: 'Wellness', icon: Sparkles, color: 'ocean-blue', description: 'Spa & Yoga' },
        { name: 'Tours', icon: Map, color: 'jungle-green', description: 'Sightseeing' },
        { name: 'Island Hopping', icon: Ship, color: 'sunset-gold', description: 'Island Adventures' },
        { name: 'Sunset', icon: Sunset, color: 'coral', description: 'Evening Experiences' }
    ];

    return (
        <MainLayout title="BaliOkayTravel - Premium Tropical Luxury">
            {/* Hero Section */}
            <section className="hero-bg pt-16 h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Floating Decoration Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 glass rounded-full animate-float opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 glass rounded-full animate-float opacity-20" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 glass rounded-full animate-float opacity-25" style={{animationDelay: '0.8s'}}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                            Discover Paradise in Bali
                        </h1>
                        <p className="text-xl sm:text-2xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto animate-fade-in-up stagger-1">
                            Experience unforgettable adventures across 13 stunning areas with 8 unique activity categories
                        </p>

                        {/* Glassmorphic Search Widget */}
                        <div className="glass-ultra rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl animate-scale-in stagger-2">
                            {/* Search Tabs */}
                            <div className="flex flex-wrap justify-center mb-6 space-x-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        className={`tab-btn px-6 py-2 rounded-full mb-2 transition-all duration-300 ${
                                            activeTab === tab ? 'tab-active' : 'glass'
                                        }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* Location */}
                                <div className="relative">
                                    <label className="block text-foreground text-sm font-medium mb-2 text-left">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground opacity-70" />
                                        <select className="w-full glass-strong border-0 rounded-2xl pl-12 pr-4 py-4 text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-ocean-blue focus:ring-opacity-30 transition-all">
                                            <option>All Areas</option>
                                            <option>Ubud</option>
                                            <option>Seminyak</option>
                                            <option>Canggu</option>
                                            <option>Nusa Dua</option>
                                            <option>Uluwatu</option>
                                            <option>Nusa Penida</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground opacity-70 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="relative">
                                    <label className="block text-foreground text-sm font-medium mb-2 text-left">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground opacity-70" />
                                        <input type="date" className="w-full glass-strong border-0 rounded-2xl pl-12 pr-4 py-4 text-foreground focus:ring-2 focus:ring-ocean-blue focus:ring-opacity-30 transition-all" />
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="relative">
                                    <label className="block text-foreground text-sm font-medium mb-2 text-left">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground opacity-70" />
                                        <select className="w-full glass-strong border-0 rounded-2xl pl-12 pr-4 py-4 text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-ocean-blue focus:ring-opacity-30 transition-all">
                                            <option>2 Adults</option>
                                            <option>1 Adult</option>
                                            <option>2 Adults, 1 Child</option>
                                            <option>2 Adults, 2 Children</option>
                                            <option>4 Adults</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground opacity-70 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button className="w-full btn-primary py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3 ripple hover:shadow-2xl">
                                <Search className="w-6 h-6" />
                                <span>Search Activities</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-16 bg-gradient-to-b from-transparent to-sand">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="glass-card rounded-2xl p-6 text-center animate-scale-in stagger-1">
                            <div className="w-16 h-16 bg-gradient-to-r from-ocean-blue to-ocean-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-foreground font-bold text-2xl mb-2">100%</h3>
                            <p className="text-foreground opacity-80 text-sm">Secure Booking</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center animate-scale-in stagger-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-sunset-gold to-sunset-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-foreground font-bold text-2xl mb-2">4.9/5</h3>
                            <p className="text-foreground opacity-80 text-sm">Customer Rating</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center animate-scale-in stagger-3">
                            <div className="w-16 h-16 bg-gradient-to-r from-jungle-green to-jungle-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <UsersIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-foreground font-bold text-2xl mb-2">50K+</h3>
                            <p className="text-foreground opacity-80 text-sm">Happy Travelers</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center animate-scale-in stagger-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-coral to-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-foreground font-bold text-2xl mb-2">24/7</h3>
                            <p className="text-foreground opacity-80 text-sm">Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Activities */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
                            Featured Activities
                        </h2>
                        <p className="text-xl text-foreground opacity-80 max-w-2xl mx-auto animate-fade-in-up stagger-1">
                            Handpicked experiences that showcase the best of Bali
                        </p>
                    </div>

                    {/* Activity Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredActivities.map((activity, index) => (
                            <div key={activity.id} className={`glass-card rounded-3xl overflow-hidden group animate-fade-in-up stagger-${index + 2}`}>
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={activity.image} 
                                        alt={activity.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Heart Icon */}
                                    <button className="absolute top-4 right-4 w-10 h-10 glass-strong rounded-full flex items-center justify-center heart-icon">
                                        <Heart className="w-5 h-5 text-foreground" />
                                    </button>
                                    {/* Price Badge */}
                                    <div className="price-badge absolute bottom-4 left-4 px-4 py-2 rounded-full">
                                        <p className="text-foreground font-bold">${activity.price} USD</p>
                                        <p className="text-foreground text-xs opacity-70">Rp {activity.priceIdr.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                                {/* Card Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`bg-${activity.categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                                            {activity.category}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-sunset-gold fill-sunset-gold" />
                                            <span className="text-foreground font-semibold">{activity.rating}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-foreground font-bold text-xl mb-2">{activity.title}</h3>
                                    <p className="text-foreground opacity-70 text-sm mb-4">
                                        Experience the thrill of riding Bali's famous waves with expert instructors
                                    </p>
                                    <div className="flex items-center text-foreground opacity-60 text-sm mb-4">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{activity.location}</span>
                                    </div>
                                    <button className="w-full btn-primary py-3 rounded-xl text-white font-semibold ripple">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-gradient-to-b from-background to-sand">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
                            Explore by Category
                        </h2>
                        <p className="text-xl text-foreground opacity-80 max-w-2xl mx-auto animate-fade-in-up stagger-1">
                            Find your perfect adventure from our 8 exciting categories
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div key={category.name} className={`glass-card category-card rounded-2xl p-8 text-center cursor-pointer animate-scale-in stagger-${index + 2}`}>
                                <div className={`w-20 h-20 bg-gradient-to-r from-${category.color} to-${category.color}-light rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                    <category.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-foreground font-bold text-lg mb-2">{category.name}</h3>
                                <p className="text-foreground opacity-70 text-sm">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-sand relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-40 h-40 glass rounded-full animate-float opacity-20"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 glass rounded-full animate-float opacity-15" style={{animationDelay: '1s'}}></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="glass-ultra rounded-3xl p-12 animate-scale-in">
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                            Ready for Your Bali Adventure?
                        </h2>
                        <p className="text-xl text-foreground opacity-80 mb-8 max-w-2xl mx-auto">
                            Join thousands of travelers who have discovered paradise with BaliOkayTravel
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn-primary px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3 ripple">
                                <Search className="w-6 h-6" />
                                <span>Explore Activities</span>
                            </button>
                            <button className="btn-secondary px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3 ripple">
                                <Phone className="w-6 h-6" />
                                <span>Contact Us</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}