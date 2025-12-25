import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { Home, Activities, ActivityDetail, Login, Register } from './pages';
import { useAuthStore } from './stores/authStore';

function App() {
    const { fetchUser } = useAuthStore();

    useEffect(() => {
        // Try to restore user session on app load
        fetchUser();
    }, [fetchUser]);

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/activities/:slug" element={<ActivityDetail />} />
            </Route>

            {/* Auth routes without main layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 */}
            <Route
                path="*"
                element={
                    <MainLayout>
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                                <p className="text-white/60 mb-8">Page not found</p>
                                <a href="/" className="btn-ocean px-6 py-3 rounded-lg inline-block">
                                    Go Home
                                </a>
                            </div>
                        </div>
                    </MainLayout>
                }
            />
        </Routes>
    );
}

export default App;
