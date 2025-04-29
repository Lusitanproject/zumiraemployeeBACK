import { Footer } from "@/components/landing-page/layout/footer";
import { Header } from "@/components/landing-page/layout/header";
import {
  Connect,
  Hero,
  PsychologicalAssistant,
  ReceptionAndReferal,
  TellYourStory
} from "@/components/landing-page/sections";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="w-full">
        <Hero />
        <ReceptionAndReferal />
        <Connect />
        <TellYourStory />
        <PsychologicalAssistant />
      </main>
      <Footer />
    </div>
  )
}