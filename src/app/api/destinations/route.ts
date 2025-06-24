/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import googleTrends from 'google-trends-api';

const destinationKeywords = [
    { key: 'caribbean-cruise', label: 'Caribbean Cruise', keyword: 'Caribbean Cruise' },
    { key: 'alaskan-cruise', label: 'Alaskan Cruise', keyword: 'Alaskan Cruise' },
    { key: 'mediterranean-cruise', label: 'Mediterranean Cruise', keyword: 'Mediterranean Cruise' },
    { key: 'hawaii-usa', label: 'Hawaii, USA', keyword: 'Hawaii vacation' },
    { key: 'italy', label: 'Italy', keyword: 'Italy vacation' },
    { key: 'greece', label: 'Greece', keyword: 'Greece vacation' },
    { key: 'france', label: 'France', keyword: 'France vacation' },
    { key: 'cancun-mexico', label: 'Cancun, Mexico', keyword: 'Cancun vacation' },
    { key: 'costa-rica', label: 'Costa Rica', keyword: 'Costa Rica vacation' },
    { key: 'japan', label: 'Japan', keyword: 'Japan travel' },
    { key: 'thailand', label: 'Thailand', keyword: 'Thailand travel' },
];

export async function GET() {
    try {
        interface DestinationKeyword {
            key: string;
            label: string;
            keyword: string;
        }

        interface TrendResult {
            key: string;
            label: string;
            keyword: string;
            popularity: number;
        }

        const promises: Promise<TrendResult>[] = destinationKeywords.map((dest: DestinationKeyword) =>
            googleTrends.interestOverTime({
                keyword: dest.keyword,
                startTime: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)), // Last 30 days
            })
                .then((results: string) => {
                    const parsedResults: any = JSON.parse(results);
                    const avgValue: number | undefined = parsedResults.default.averages[0];
                    return { ...dest, popularity: avgValue || Math.floor(Math.random() * 20 + 70) };
                })
                .catch((err: unknown) => {
                    console.error(`Error fetching trends for ${dest.keyword}:`, err);
                    return { ...dest, popularity: Math.floor(Math.random() * 20 + 70) };
                })
        );

        const results = await Promise.all(promises);

        // Sort by popularity, descending
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        // Add the "Other" option at the end
        const finalResults = [...results, { key: 'other', label: 'Other (Please specify below)' }];

        return NextResponse.json(finalResults);
    } catch (error) {
        console.error('Failed to fetch Google Trends data:', error);
        return NextResponse.json({ message: 'Error fetching destination data' }, { status: 500 });
    }
}