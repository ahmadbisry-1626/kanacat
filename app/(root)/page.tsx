import CatCard from "@/components/CatCard";
import HeroSection from "@/components/HeroSection";
import { searchParams } from "@/types";

export default async function Home({ searchParams }: searchParams) {
    const pageParam = searchParams.page?.toString() || '1'
    const page = parseInt(pageParam)
    const limit = 9

    return (
        <main className="w-screen bg-white overflow-hidden">
            <HeroSection />
            <CatCard page={page} limit={limit} />
        </main>
    );
}
