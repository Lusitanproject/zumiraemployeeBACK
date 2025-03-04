import { ReactNode } from "react"
import { Sidebar } from "@/components/custom/sidebar"
import { Header } from "@/components/custom/header"
import { TabBar } from "@/components/custom/tab-bar"

type LayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen flex overflow-hidden">
      <Sidebar />
      <div className="relative h-screen w-full md:w-auto md:flex-1 bg-white overflow-hidden md:overflow-y-auto pt-20 md:pt-24 pb-[121px] md:pb-6">
        <div className="h-full overflow-y-auto px-4 md:px-16">
          {children}
        </div>
        <Header />
        <TabBar />
      </div>
    </div>
  )
}
