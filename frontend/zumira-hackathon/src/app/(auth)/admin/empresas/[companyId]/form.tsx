"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trail } from "@/types/trail";

import { Company, FormErrors, INITIAL_VALUE, ManageCompany, ManageCompanySchema } from "./definitions";
import { saveCompany } from "./form-actions";

type FormProps = {
  trails: Trail[];
  data: Company | null;
};

export function CompanyForm({ data, trails }: FormProps) {
  const [formData, setFormData] = useState<ManageCompany>(data ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageCompanySchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveCompany(payload);

    if (response) {
      setFormError(response);
    }

    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/empresas");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="name">
            Nome da empresa
          </Label>
          <Input
            className="text-text-700"
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
          <Label className="text-text-700" htmlFor="email">
            E-mail
          </Label>
          <Input
            className="text-text-700"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData((current) => ({ ...current, email: e.target.value }));
            }}
          />
          {!!errors?.email && <span className="text-sm text-error-500">{errors.email}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="trail">
            Trilha
          </Label>
          <Select
            name="trail"
            value={formData.trailId}
            onValueChange={(value) => {
              setFormData((current) => ({ ...current, trailId: value }));
            }}
          >
            <SelectTrigger className="w-64 bg-background-0 text-text-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-text-700">
              {trails.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.trailId && <span className="text-sm text-error-500">{errors.trailId}</span>}
        </div>
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-border-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-background-50 flex items-center md:justify-start gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button disabled={loading} loading={loading} size="xl" variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
