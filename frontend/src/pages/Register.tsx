import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Logo } from '../components/common';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../hooks/use-toast';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading, clearError } = useAuthStore();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (password !== passwordConfirmation) {
            toast({
                title: 'Passwords do not match',
                description: 'Please make sure your passwords match.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await register(name, email, password, passwordConfirmation);
            toast({
                title: 'Welcome to BaliokaTravel!',
                description: 'Your account has been created successfully.',
            });
            navigate('/');
        } catch (err: any) {
            toast({
                title: 'Registration failed',
                description: err.response?.data?.message || 'Could not create account',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="glass-card rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <Logo />
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/60">Join us and start your Bali adventure</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-white/10 border-white/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/10 border-white/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="bg-white/10 border-white/20 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-white/40">Must be at least 8 characters</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                        <Input
                            id="passwordConfirmation"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            className="bg-white/10 border-white/20"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full btn-ocean"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>
                </form>

                <p className="mt-6 text-center text-xs text-white/40">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                        Privacy Policy
                    </Link>
                </p>

                <div className="mt-6 text-center text-white/60">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-primary/80">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
