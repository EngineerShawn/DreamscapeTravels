import { notFound } from 'next/navigation';
import { destinations, getDestinationBySlug } from "@/data/destinations";
import type { Metadata } from 'next';
import DestinationClientPage from './client-page';


type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export function generateStaticParams() {
    return destinations.map((destination) => ({
        slug: destination.slug,
    }));
}

export function generateMetadata({ params }: Props): Metadata {
    const destination = getDestinationBySlug(params.slug);

    if (!destination) {
        return {
            title: 'Destination Not Found',
        };
    }
    return {
        title: `${destination.name} | Dreamscape Travels`,
        description: `Explore ${destination.name}. ${destination.description.substring(0, 120)}...`,
    };
}

export default function DestinationDetailPage({ params }: Props) {
    const destination = getDestinationBySlug(params.slug);

    if (!destination) {
        notFound();
    }

    return <DestinationClientPage destination={destination} />;
}