import { Footer } from "@/components/landing-page/layout/footer";
import { Header } from "@/components/landing-page/layout/header";
import {
  HeroCompany,
  HowItWorks,
  NationalRecognition,
  Schedule,
  WhyItMatters
} from "@/components/landing-page/sections";

export default function CompanyPage() {
  return (
    <div>
      <Header />
      <main className="w-full">
        <HeroCompany />
        <WhyItMatters />
        <NationalRecognition />
        <HowItWorks />
        <Schedule />
      </main>
      <Footer />
    </div>
  )
}