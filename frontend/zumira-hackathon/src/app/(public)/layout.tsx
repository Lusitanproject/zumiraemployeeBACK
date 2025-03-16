import { HeadImage } from "@/components/custom/head-image"
import { ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[58vw_42vw] grid-rows-1">
      <section className="bg-primary-25 flex items-center justify-center">
        <HeadImage />
      </section>
      <div className="h-screen px-4 py-14 bg-white overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
