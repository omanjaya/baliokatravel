import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

interface Props {
    status: number;
}

export default function Error({ status }: Props) {
    const title = {
        404: 'Page Not Found',
        403: 'Access Denied',
        500: 'Server Error',
        503: 'Service Unavailable',
    }[status] || 'Error';

    const description = {
        404: "Sorry, the page you're looking for doesn't exist or has been moved.",
        403: "Sorry, you don't have permission to access this page.",
        500: "Oops! Something went wrong on our end. We're working on it.",
        503: "We're currently performing maintenance. Please check back soon.",
    }[status] || "Something went wrong.";

    const emoji = {
        404: '🔍',
        403: '🔒',
        500: '⚙️',
        503: '🔧',
    }[status] || '❌';

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4">
                <div className="max-w-lg text-center">
                    {/* Error Code */}
                    <div className="text-8xl font-bold text-sky-200 mb-4">
                        {status}
                    </div>

                    {/* Emoji */}
                    <div className="text-6xl mb-6">{emoji}</div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-muted-foreground mb-8">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                        <Link href="/">
                            <Button>
                                <Home className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="secondary">
                                <Search className="h-4 w-4 mr-2" />
                                Browse Activities
                            </Button>
                        </Link>
                    </div>

                    {/* Contact Info */}
                    {status === 500 && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                If this problem persists, please contact us at{' '}
                                <a
                                    href="mailto:support@baliokatravel.com"
                                    className="text-sky-600 hover:underline"
                                >
                                    support@baliokatravel.com
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
