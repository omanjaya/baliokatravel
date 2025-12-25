import { Link } from '@inertiajs/react';

interface LogoProps {
    variant?: 'default' | 'white';
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
    asLink?: boolean;
}

const sizeClasses = {
    sm: {
        icon: 'w-8 h-8',
        iconText: 'text-lg',
        brandText: 'text-lg',
    },
    md: {
        icon: 'w-10 h-10',
        iconText: 'text-xl',
        brandText: 'text-xl',
    },
    lg: {
        icon: 'w-12 h-12',
        iconText: 'text-2xl',
        brandText: 'text-2xl',
    },
};

export function Logo({
    variant = 'default',
    showText = true,
    size = 'md',
    asLink = true
}: LogoProps) {
    const sizes = sizeClasses[size];
    const isWhite = variant === 'white';

    const content = (
        <div className="flex items-center gap-2 group">
            <div className={`${sizes.icon} bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <span className={`text-white font-bold ${sizes.iconText}`}>B</span>
            </div>
            {showText && (
                <div>
                    <span className={`font-bold ${sizes.brandText} ${isWhite ? 'text-white' : 'bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent'}`}>
                        Balioka
                    </span>
                    <span className={`${sizes.brandText} ${isWhite ? 'text-gray-200' : 'text-gray-700'}`}>
                        Travel
                    </span>
                </div>
            )}
        </div>
    );

    if (asLink) {
        return <Link href="/">{content}</Link>;
    }

    return content;
}
