import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Logo } from '../components/common';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../hooks/use-toast';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        try {
            await login(email, password);
            toast({
                title: 'Welcome back!',
                description: 'You have successfully logged in.',
            });
            navigate(from, { replace: true });
        } catch (err: any) {
            toast({
                title: 'Login failed',
                description: err.response?.data?.message || 'Invalid credentials',
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
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/60">Sign in to continue your adventure</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:text-primary/80"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                    </div>

                    <Button
                        type="submit"
                        className="w-full btn-ocean"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center text-white/60">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:text-primary/80">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
