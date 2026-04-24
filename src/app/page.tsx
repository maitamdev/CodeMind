import HeroSection from "@/components/Home/HeroSection";
import CoursesSection from "@/components/Home/CoursesSection";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      <HeroSection />
      <CoursesSection />
    </div>
  );
}