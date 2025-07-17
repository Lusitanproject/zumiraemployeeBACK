import { Building2, Calendar, FileCheck2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Assessment } from "@/types/assessment";
import { Company } from "@/types/company";

interface FiltersProps {
  assessments: Assessment[];
  companies: Company[];
}

export function Filters({ assessments, companies }: FiltersProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const companyId = searchParams.get("company") || companies[0]?.id || "";
  const assessmentId = searchParams.get("assessment") || assessments[0]?.id || "";

  // Data padrão: um ano atrás até hoje
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const dateFrom = searchParams.get("dateFrom") || oneYearAgo.toISOString().split("T")[0];
  const dateTo = searchParams.get("dateTo") || today.toISOString().split("T")[0];

  const handleChangeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (!searchParams.get("assessment") && assessments[0]?.id) {
      params.set("assessment", assessments[0].id);
    }
    if (!searchParams.get("company") && companies[0]?.id) {
      params.set("company", companies[0].id);
    }
    if (!searchParams.get("dateFrom")) {
      params.set("dateFrom", dateFrom);
    }
    if (!searchParams.get("dateTo")) {
      params.set("dateTo", dateTo);
    }

    if (params.toString() !== searchParams.toString()) {
      replace(`${pathname}?${params.toString()}`);
    }
  }, [assessments, companies, dateFrom, dateTo, searchParams, pathname, replace]);

  return (
    <div className="flex flex-row gap-4 mt-2 flex-wrap">
      <div className="flex flex-row gap-2 items-center">
        <Building2 className="size-8 text-primary-400" />
        <Select name="company" value={companyId} onValueChange={(value) => handleChangeFilter("company", value)}>
          <SelectTrigger className="w-64 bg-background-0 text-text-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-text-700">
            {companies?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <FileCheck2 className="size-8 text-primary-400" />
        <Select
          name="assessment"
          value={assessmentId}
          onValueChange={(value) => handleChangeFilter("assessment", value)}
        >
          <SelectTrigger className="w-64 bg-background-0 text-text-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-text-700">
            {assessments?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Calendar className="size-8 text-primary-400 flex-shrink-0" />
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1">
          <div className="flex flex-row gap-1.5 items-center justify-end">
            <span className="text-text-400 whitespace-nowrap">de:</span>
            <Input
              className="w-44 h-[2.25rem] bg-background-0 text-text-700"
              type="date"
              value={dateFrom}
              onChange={(e) => handleChangeFilter("dateFrom", e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-1.5 items-center justify-end">
            <span className="text-text-400 whitespace-nowrap">até:</span>
            <Input
              className="w-44 h-[2.25rem] bg-background-0 text-text-700"
              type="date"
              value={dateTo}
              onChange={(e) => handleChangeFilter("dateTo", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
