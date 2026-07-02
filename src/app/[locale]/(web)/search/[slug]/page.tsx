'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, AlertCircle, ChevronDown } from 'lucide-react';
import type { CampaignResponseDto } from '@/lib/types';

const ITEMS_PER_PAGE = 12;

export default function SearchSlugPage({ params }: { params: { slug: string } }) {
    const [campaigns, setCampaigns] = useState<CampaignResponseDto[]>([]);
    const [filtered, setFiltered] = useState<CampaignResponseDto[]>([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Decode slug and use as initial filter
    const initialFilter = decodeURIComponent(params.slug).toLowerCase();

    // Fetch campaigns on mount
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/campaigns/search/public`, {
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch campaigns');
                }

                const data: CampaignResponseDto[] = await response.json();
                setCampaigns(data);

                // Auto-filter by slug on first load
                const lowerSlug = initialFilter;
                const results = data.filter(
                    (campaign) =>
                        campaign.title.toLowerCase().includes(lowerSlug) ||
                        campaign.description.toLowerCase().includes(lowerSlug)
                );
                setFiltered(results);
                setQuery(initialFilter);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [initialFilter]);

    // Setup Intersection Observer for lazy loading images
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            observerRef.current?.unobserve(img);
                        }
                    }
                });
            },
            { rootMargin: '100px' }
        );

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Observe new images when they appear
    useEffect(() => {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach((img) => {
            if (observerRef.current) {
                observerRef.current.observe(img);
            }
        });
    }, [filtered]);

    // Filter campaigns by search query
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const results = campaigns.filter(
            (campaign) =>
                campaign.title.toLowerCase().includes(lowerQuery) ||
                campaign.description.toLowerCase().includes(lowerQuery)
        );
        setFiltered(results);
        setCurrentPage(1); // Reset to first page when filtering
    }, [query, campaigns]);

    // Get paginated results
    const paginatedCampaigns = filtered.slice(0, currentPage * ITEMS_PER_PAGE);
    const hasMore = paginatedCampaigns.length < filtered.length;

    const handleLoadMore = useCallback(() => {
        setCurrentPage((prev) => prev + 1);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-background border-b border-border sticky top-0 z-10 pt-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Explore Campaigns</h1>
                    <p className="text-muted">Discover and support campaigns you care about</p>
                </div>
            </div>

            {/* Search Input & Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-3 text-accent" size={20} />
                    <input
                        type="text"
                        placeholder="Search campaigns by name or description..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition bg-background text-foreground placeholder-muted"
                    />
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-8">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-surface rounded-lg h-64 animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted text-lg">
                            {campaigns.length === 0
                                ? 'No campaigns available yet'
                                : 'No campaigns match your search'}
                        </p>
                    </div>
                )}

                {/* Campaign Grid */}
                {!loading && paginatedCampaigns.length > 0 && (
                    <>
                        <p className="text-sm text-muted mb-6">
                            Showing {paginatedCampaigns.length} of {filtered.length} campaign
                            {filtered.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedCampaigns.map((campaign) => (
                                <Link
                                    key={campaign.id}
                                    href={`/campaign/${campaign.slug}`}
                                    className="group"
                                >
                                    <div className="bg-background rounded-lg overflow-hidden shadow-soft hover:shadow-lift transition-shadow duration-300 h-full flex flex-col border border-border">
                                        {/* Cover Photo with Lazy Loading */}
                                        {campaign.coverPhotoUrl ? (
                                            <div className="relative w-full h-48 overflow-hidden bg-surface">
                                                <img
                                                    data-src={campaign.coverPhotoUrl}
                                                    alt={campaign.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-surface"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                                                <p className="text-accent-foreground font-semibold">No image</p>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-accent transition">
                                                {campaign.title}
                                            </h3>
                                            <p className="text-muted text-sm mb-4 line-clamp-2 flex-grow">
                                                {campaign.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="border-t border-border pt-4 mt-auto">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs text-muted uppercase tracking-wider">
                                                            Raised
                                                        </p>
                                                        <p className="font-bold text-foreground">
                                                            A${campaign.raisedAmount?.toFixed(2) || '0.00'}
                                                        </p>
                                                    </div>
                                                    {campaign.goalAmount && (
                                                        <div>
                                                            <p className="text-xs text-muted uppercase tracking-wider">
                                                                Goal
                                                            </p>
                                                            <p className="font-bold text-foreground">
                                                                A${campaign.goalAmount.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Progress Bar */}
                                                {campaign.goalAmount && campaign.goalAmount > 0 && (
                                                    <div className="mt-3 w-full bg-surface rounded-full h-2">
                                                        <div
                                                            className="bg-accent h-2 rounded-full transition-all"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (campaign.raisedAmount / campaign.goalAmount) * 100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:shadow-lift transition-shadow duration-300"
                                >
                                    Load more
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
