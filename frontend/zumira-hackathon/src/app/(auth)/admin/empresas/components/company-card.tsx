import Link from "next/link"
import { Building2 } from "lucide-react"
import { Company } from "../definitions"

export type CardProps = {
  data: Company
}

export function CompanyCard({ data }: CardProps) {
  return (
    <Link
      href={`/admin/empresas/${data.id}`}
      className="p-[1.375rem] rounded-xl bg-gray-100"
    >
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center font-bold">
          <Building2 className="size-5" />
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-700 mb-1">{data.name}</h3>
      </div>
    </Link>
  )
}
