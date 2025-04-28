"use client";

import { useCallback, useState } from "react";
import {
  Dimension,
  FormErrors,
  INITIAL_VALUE,
  ManageDimension,
  ManageDimensionSchema,
  MonitoringBlock,
} from "./definitions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { saveDimension } from "./form-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormProps = {
  data: Dimension | null;
  blocks: MonitoringBlock[];
};

export function DimensionForm({ data, blocks }: FormProps) {
  const parsedUser = data && {
    acronym: data.acronym,
    name: data.name,
    selfMonitoringBlockId: data.selfMonitoringBlock.id,
  };

  const [formData, setFormData] = useState<ManageDimension>(parsedUser ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);

  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setErrors(null);
    const validation = ManageDimensionSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveDimension(payload);

    if (response) {
      setFormError(response);
    }
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/dimensoes");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="title">Sigla</Label>
          <Input
            id="acronym"
            name="acronym"
            value={formData.acronym}
            onChange={(e) => {
              setFormData((current) => ({ ...current, acronym: e.target.value }));
            }}
          />
          {!!errors?.acronym && <span className="text-sm text-error-500">{errors.acronym}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="title">Nome</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setFormData((current) => ({ ...current, name: e.target.value }));
            }}
          />
          {!!errors?.name && <span className="text-sm text-error-500">{errors.name}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="companyId">Bloco de Autoconhecimento</Label>
          <Select
            name="selfMonitoringBlockId"
            defaultValue={formData.selfMonitoringBlockId}
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                selfMonitoringBlockId: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blocks?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.selfMonitoringBlockId && (
            <span className="text-sm text-error-500">{errors.selfMonitoringBlockId}</span>
          )}
        </div>
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-start gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button size="xl" variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
