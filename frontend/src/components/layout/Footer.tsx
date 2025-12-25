import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { Logo } from '../common';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Logo />
                        <p className="text-white/60 mt-4 text-sm leading-relaxed">
                            Discover the magic of Bali with curated activities and experiences.
                            From adventure to relaxation, we have something for everyone.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/activities" className="text-white/60 hover:text-white transition-colors text-sm">
                                    All Activities
                                </Link>
                            </li>
                            <li>
                                <Link to="/areas" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Explore Areas
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Areas */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Popular Areas</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/areas/ubud" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Ubud
                                </Link>
                            </li>
                            <li>
                                <Link to="/areas/seminyak" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Seminyak
                                </Link>
                            </li>
                            <li>
                                <Link to="/areas/canggu" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Canggu
                                </Link>
                            </li>
                            <li>
                                <Link to="/areas/nusa-penida" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Nusa Penida
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-white/60 text-sm">
                                    Jl. Raya Ubud No. 123, Ubud, Bali 80571
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <a
                                    href="mailto:hello@baliokatravel.com"
                                    className="text-white/60 hover:text-white transition-colors text-sm"
                                >
                                    hello@baliokatravel.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <a
                                    href="tel:+6281234567890"
                                    className="text-white/60 hover:text-white transition-colors text-sm"
                                >
                                    +62 812 3456 7890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        &copy; {currentYear} BaliokaTravel. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-white/40 hover:text-white/60 transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-white/40 hover:text-white/60 transition-colors text-sm">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
