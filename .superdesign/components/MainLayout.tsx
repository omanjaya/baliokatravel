import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Menu, X, Waves, Search, Phone, Facebook, Instagram, Twitter, Shield, Globe } from 'lucide-react';

export default function MainLayout({ title, children }: { title: string, children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title={title} />
            
            {/* Sticky Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 animate-fade-in">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ocean-blue to-ocean-blue-light flex items-center justify-center">
                                <Waves className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">BaliOkayTravel</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8 animate-fade-in stagger-1">
                            <Link href="#" className="text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">Activities</Link>
                            <Link href="#" className="text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">Areas</Link>
                            <Link href="#" className="text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">About</Link>
                            <Link href="#" className="text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">Contact</Link>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center space-x-4 animate-fade-in stagger-2">
                            <button className="hidden sm:block glass px-6 py-2 rounded-full text-foreground font-medium ripple">
                                Sign In
                            </button>
                            <button className="btn-primary px-6 py-2 rounded-full text-white font-medium ripple">
                                Book Now
                            </button>
                            {/* Mobile Menu */}
                            <button 
                                className="md:hidden text-foreground"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu fixed top-0 left-0 w-64 h-full bg-white z-40 shadow-xl md:hidden ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ocean-blue to-ocean-blue-light flex items-center justify-center">
                                <Waves className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">BaliOkayTravel</span>
                        </div>
                        <button 
                            className="text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <Link href="#" className="block py-2 text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">Activities</Link>
                        <Link href="#" className="block py-2 text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">Areas</Link>
                        <Link href="#" className="block py-2 text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">About</Link>
                        <Link href="#" className="block py-2 text-foreground hover:text-ocean-blue transition-all duration-300 font-medium">Contact</Link>
                        <div className="pt-4 border-t border-border">
                            <button className="w-full glass px-6 py-2 rounded-full text-foreground font-medium ripple mb-3">
                                Sign In
                            </button>
                            <button className="w-full btn-primary px-6 py-2 rounded-full text-white font-medium ripple">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-foreground text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ocean-blue to-ocean-blue-light flex items-center justify-center">
                                    <Waves className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-2xl font-bold">BaliOkayTravel</span>
                            </div>
                            <p className="text-white opacity-70 mb-6 max-w-md">
                                Your trusted partner for unforgettable Bali experiences. Discover 13 stunning areas and 8 exciting activity categories.
                            </p>
                            <div className="flex space-x-4">
                                <button className="w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all">
                                    <Facebook className="w-5 h-5 text-white" />
                                </button>
                                <button className="w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all">
                                    <Instagram className="w-5 h-5 text-white" />
                                </button>
                                <button className="w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all">
                                    <Twitter className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">About Us</Link></li>
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Activities</Link></li>
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Areas</Link></li>
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Help Center</Link></li>
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Booking Policy</Link></li>
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Privacy Policy</Link></li>
                                <li><Link href="#" className="text-white opacity-70 hover:opacity-100 transition-all">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white border-opacity-20 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-white opacity-60 text-sm">
                                © 2025 BaliOkayTravel. All rights reserved.
                            </p>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5 text-white opacity-60" />
                                    <span className="text-white opacity-60 text-sm">Secure Payment</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-5 h-5 text-white opacity-60" />
                                    <span className="text-white opacity-60 text-sm">IDR / USD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}