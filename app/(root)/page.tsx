import CatCard from "@/components/CatCard";
import HeroSection from "@/components/HeroSection";
import { searchParams } from "@/types";

export default async function Home({ searchParams }: searchParams) {
    const query = (await searchParams).query

    return (
        <main className="w-screen bg-white-background overflow-hidden">
            <HeroSection />
            <CatCard />
        </main>
    );
}
