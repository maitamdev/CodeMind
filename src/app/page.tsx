import HeroSection from "@/components/Home/HeroSection";
import FeatureHighlights from "@/components/Home/FeatureHighlights";
import HomepageCTASection from "@/components/Home/HomepageCTASection";
import ContinueLearningSection from "@/components/Home/ContinueLearningSection";
import LaunchChecklistSection from "@/components/Home/LaunchChecklistSection";
import PersonalizedLearningSection from "@/components/Home/PersonalizedLearningSection";
import LearningJourneySection from "@/components/Home/LearningJourneySection";
import MarketPlaceSpotlightSection from "@/components/Home/MarketPlaceSpotlightSection";
import UpgradeRoadmapSection from "@/components/Home/UpgradeRoadmapSection";
import CoursesSection from "@/components/Home/CoursesSection";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      <HeroSection />
      <FeatureHighlights />
      <PersonalizedLearningSection />
      <LaunchChecklistSection />
      <ContinueLearningSection />
      <LearningJourneySection />
      <HomepageCTASection />
      <MarketPlaceSpotlightSection />
      <UpgradeRoadmapSection />
      <CoursesSection />
    </div>
  );
}
