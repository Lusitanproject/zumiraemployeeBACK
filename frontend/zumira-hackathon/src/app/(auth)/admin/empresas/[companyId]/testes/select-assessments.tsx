"use client";

import { Divider } from "@/components/custom/divider";
import { Input } from "@/components/ui/input";
import { Assessment } from "@/types/assessment";
import { Company } from "@/types/company";
import { Search } from "lucide-react";
import { AssessmentList } from "./components/assessment-list";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { setCompanyAvailableAssessments } from "@/api/companies";
import { toast } from "sonner";

interface SelectAssessentsProps {
  company: Company;
  assessments: Assessment[];
}

export function SelectAssessments({ assessments, company }: SelectAssessentsProps) {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Assessment[]>(
    assessments.filter((a) => company.companyAvailableAssessments.some((b) => a.id === b.assessmentId))
  );

  const debouncedSave = useDebouncedCallback(async (assessments: Assessment[]) => {
    try {
      await setCompanyAvailableAssessments(
        company.id,
        assessments.map((a) => a.id)
      );
    } catch {
      toast.error("Erro ao salvar testes da empresa.");
    }
  }, 1000);

  function handleToggleAssessment(assessment: Assessment, selected: boolean) {
    setSelected((prev) => {
      let updated;

      if (selected) {
        updated = [...prev, assessment];
      } else {
        updated = prev.filter((a) => a.id !== assessment.id);
      }

      debouncedSave(updated);

      return updated;
    });
  }

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <Input
        icon={Search}
        className="w-full"
        hasIcon
        placeholder="Pesquise por um teste"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <div className="flex flex-row gap-3 size-full min-h-0">
        <AssessmentList
          title="Selecionados"
          assessments={selected}
          search={search}
          onToggleAssessment={handleToggleAssessment}
          selected
        />

        <Divider />

        <AssessmentList
          search={search}
          title="Não Selecionados"
          assessments={assessments.filter((a) => !selected.some((b) => a.id === b.id))}
          onToggleAssessment={handleToggleAssessment}
        />
      </div>
    </div>
  );
}
