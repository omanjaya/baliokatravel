import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from '../common';
import { useAuthStore } from '../../stores/authStore';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="/activities"
                            className="text-white/80 hover:text-white transition-colors font-medium"
                        >
                            Activities
                        </Link>
                        <Link
                            to="/areas"
                            className="text-white/80 hover:text-white transition-colors font-medium"
                        >
                            Explore Bali
                        </Link>
                        <Link
                            to="/about"
                            className="text-white/80 hover:text-white transition-colors font-medium"
                        >
                            About
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/activities">
                            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                                <Search className="w-5 h-5" />
                            </Button>
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/bookings">
                                    <Button variant="ghost" className="text-white/80 hover:text-white">
                                        My Bookings
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/80 text-sm">{user?.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLogout}
                                        className="text-white/80 hover:text-white"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" className="text-white/80 hover:text-white">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="btn-ocean">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-white/10">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        <Link
                            to="/activities"
                            className="text-white/80 hover:text-white transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Activities
                        </Link>
                        <Link
                            to="/areas"
                            className="text-white/80 hover:text-white transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explore Bali
                        </Link>
                        <Link
                            to="/about"
                            className="text-white/80 hover:text-white transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>

                        <div className="border-t border-white/10 pt-4 mt-2">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/bookings"
                                        className="block text-white/80 hover:text-white py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-white/80 hover:text-white py-2 w-full"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="btn-ocean w-full">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;
