import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Menu, X, Waves, ShieldCheck, Globe } from 'lucide-react';
import { useState } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar - Glass Effect */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 animate-fade-in">
                            <div className="w-10 h-10 rounded-full ocean-gradient-3 flex items-center justify-center">
                                <Waves className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">BaliokaTravel</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8 animate-fade-in stagger-1">
                            <Link
                                href="/"
                                className="text-white hover:text-white/80 transition-all duration-300 font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/search"
                                className="text-white hover:text-white/80 transition-all duration-300 font-medium"
                            >
                                Activities
                            </Link>
                            <Link
                                href="/search"
                                className="text-white hover:text-white/80 transition-all duration-300 font-medium"
                            >
                                Areas
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-white hover:text-white/80 transition-all duration-300 font-medium"
                            >
                                My Bookings
                            </Link>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center space-x-4 animate-fade-in stagger-2">
                            <Link href="/login" className="hidden sm:block">
                                <button className="btn-glass px-6 py-2 rounded-full text-white font-medium">
                                    Sign In
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="btn-ocean px-6 py-2 rounded-full text-white font-medium">
                                    Book Now
                                </button>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden text-white p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="py-4 border-t border-white/20">
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/"
                                    className="text-white hover:text-white/80 font-medium transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/search"
                                    className="text-white hover:text-white/80 font-medium transition-colors"
                                >
                                    Activities
                                </Link>
                                <Link
                                    href="/search"
                                    className="text-white hover:text-white/80 font-medium transition-colors"
                                >
                                    Areas
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="text-white hover:text-white/80 font-medium transition-colors"
                                >
                                    My Bookings
                                </Link>
                                <div className="flex gap-3 pt-4 border-t border-white/20">
                                    <Link href="/login" className="flex-1">
                                        <button className="w-full btn-glass py-2 rounded-full text-white font-medium">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link href="/register" className="flex-1">
                                        <button className="w-full btn-ocean py-2 rounded-full text-white font-medium">
                                            Register
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 pt-16">{children}</main>

            {/* Footer - Ocean Glass Theme */}
            <footer className="bg-[#0d1b2a] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 rounded-full ocean-gradient-3 flex items-center justify-center">
                                    <Waves className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-2xl font-bold text-white">BaliokaTravel</span>
                            </div>
                            <p className="text-white/70 mb-6 max-w-md">
                                Your trusted partner for unforgettable Bali experiences. Discover 13 stunning areas and 8 exciting activity categories.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    aria-label="Follow us on Facebook"
                                    className="w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <Facebook className="w-5 h-5 text-white" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Follow us on Instagram"
                                    className="w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Follow us on Twitter"
                                    className="w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <Twitter className="w-5 h-5 text-white" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/" className="text-white/70 hover:text-white transition-all">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search" className="text-white/70 hover:text-white transition-all">
                                        Activities
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search" className="text-white/70 hover:text-white transition-all">
                                        Areas
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="text-white/70 hover:text-white transition-all">
                                        My Bookings
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-white/70">
                                    <Mail className="w-4 h-4" />
                                    <span>hello@baliokatravel.com</span>
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <Phone className="w-4 h-4" />
                                    <span>+62 361 123 4567</span>
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <MapPin className="w-4 h-4" />
                                    <span>Bali, Indonesia</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/20 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-white/60 text-sm">
                                © {new Date().getFullYear()} BaliokaTravel. All rights reserved.
                            </p>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <ShieldCheck className="w-5 h-5 text-white/60" />
                                    <span className="text-white/60 text-sm">Secure Payment</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-5 h-5 text-white/60" />
                                    <span className="text-white/60 text-sm">IDR / USD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
