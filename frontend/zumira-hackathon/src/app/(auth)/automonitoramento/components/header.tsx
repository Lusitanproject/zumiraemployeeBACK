import { HeadImageSmall } from "@/components/custom/head-image-simple";
import { ArrowDown } from "lucide-react";

export function Header() {
  return (
    <div className="w-full h-32 bg-gray-100 rounded-xl flex justify-between items-center p-6 mb-8">
      <div className="flex items-center gap-x-8">
        <HeadImageSmall />
        <h3 className="font-medium text-lg text-gray-500">Minha Saúde Mental</h3>
      </div>
      <div className="flex items-center gap-x-2 justify-end">
        <span className="text-sm font-semibold text-gray-400">Veja a devolutiva</span>
        <ArrowDown className="size-5 text-gray-400" />
      </div>
    </div>
  )
}
