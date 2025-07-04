import { Building2, FileCheck2 } from "lucide-react";
import { useContext } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertsContext } from "@/providers/alerts";
import { Assessment } from "@/types/assessment";
import { Company } from "@/types/company";

interface FiltersProps {
  assessments: Assessment[];
  companies: Company[];
}

export function Filters({ assessments, companies }: FiltersProps) {
  const { setAssessmentId, assessmentId, companyId, setCompanyId } = useContext(AlertsContext);

  return (
    <div className="flex flex-row gap-4 mt-2">
      <div className="flex flex-row gap-2 items-center">
        <Building2 className="size-8 text-primary-400" />
        <Select defaultValue={companyId} name="company" onValueChange={(value) => setCompanyId(value)}>
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
        <Select defaultValue={assessmentId} name="assessment" onValueChange={(value) => setAssessmentId(value)}>
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
    </div>
  );
}
