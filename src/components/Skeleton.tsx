import { createElement, type JSX } from 'react';

type BoxProps = {
    className?: string;
    as?: keyof JSX.IntrinsicElements;
};

/**
 * SkeletonBox — generic shimmer placeholder block.
 * You can render as <div>, <span>, <p>, etc.
 */
export function SkeletonBox({ className = '', as = 'div' }: BoxProps) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return createElement(
        Tag,
        { className: `animate-pulse rounded-md bg-gray-200/70 ${className}` },
        null
    );
}


/** Grid placeholder for book cards */
export function CatalogGridSkeleton({ count = 8 }: { count?: number }) {
    const items = Array.from({ length: count });
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-3">
                    <SkeletonBox className="aspect-[3/4] w-full rounded-xl" />
                    <SkeletonBox className="mt-3 h-4 w-3/4" />
                    <SkeletonBox className="mt-2 h-3 w-1/2" />
                    <SkeletonBox className="mt-3 h-5 w-1/3" />
                </div>
            ))}
        </div>
    );
}
