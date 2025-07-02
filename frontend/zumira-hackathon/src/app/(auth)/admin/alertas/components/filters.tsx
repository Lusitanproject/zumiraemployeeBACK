import { useEffect, useRef } from "react";

import { Label } from "@/components/custom/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Assessment, Company, Filters as FiltersType } from "../definitions";

interface FiltersProps {
  assessments: Assessment[];
  companies: Company[];
  totalResults?: number;
  onChangeFilters?: (data: FiltersType) => void;
}

export function Filters({ assessments, companies, totalResults, onChangeFilters }: FiltersProps) {
  const assessmentId = useRef<string>(assessments.length ? assessments[0].id : undefined);
  const companyId = useRef<string>(companies.length ? companies[0].id : undefined);

  useEffect(() => {
    if (assessmentId.current && companyId.current) {
      onChangeFilters?.({ assessmentId: assessmentId.current, companyId: companyId.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background-100 p-3 pt-2 rounded-xl border-1 border-border-300">
      <span className="text-lg font-semibold text-text-400">Filtros</span>
      <div className="flex flex-row w-full justify-between items-end flex-wrap">
        <div className="flex flex-row gap-2 items-center flex-wrap">
          <div>
            <Label htmlFor="company">Empresa</Label>
            <Select
              defaultValue={companyId.current}
              name="company"
              onValueChange={(value) => {
                companyId.current = value;
                if (assessmentId.current) {
                  onChangeFilters?.({ assessmentId: assessmentId.current, companyId: value });
                }
              }}
            >
              <SelectTrigger className="w-64 bg-background-0 text-text-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companies?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assessment">Teste</Label>
            <Select
              defaultValue={assessmentId.current}
              name="assessment"
              onValueChange={(value) => {
                assessmentId.current = value;
                onChangeFilters?.({ assessmentId: value, companyId: companyId.current });
              }}
            >
              <SelectTrigger className="w-64 bg-background-0 text-text-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assessments?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <span className="text-text-500 text-sm">Mostrando {totalResults ?? 0} resultados</span>
      </div>
    </div>
  );
}
