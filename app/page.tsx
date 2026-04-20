import BestCombos from "./components/BestCombos";
import CtaBanner from "./components/CtaBanner";
import Faqs from "./components/Faqs";
import HeroSlider from "./components/HeroSlider";
import TabbedCombos from "./components/TabbedCombos";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <HeroSlider />
      <BestCombos />
      <TabbedCombos />
      <Faqs />
      <CtaBanner />
    </main>
  );
}
