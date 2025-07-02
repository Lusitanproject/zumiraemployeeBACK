"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

import { IconName } from "@/components/custom/icon";
import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { IconField } from "./components/icons";
import {
  FormErrors,
  INITIAL_VALUE,
  ManageMonitoringBlock,
  ManageMonitoringBlockSchema,
  MonitoringBlock,
} from "./definitions";
import { saveSelfMonitoringBlock } from "./form-actions";

type FormProps = {
  data: MonitoringBlock | null;
};

export function SelfMonitoringBlockForm({ data }: FormProps) {
  const [formData, setFormData] = useState<ManageMonitoringBlock>(data ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(null);
    const validation = ManageMonitoringBlockSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData,
    };

    const response = await saveSelfMonitoringBlock(payload);

    if (response) {
      setFormError(response);
    }

    setLoading(false);
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/autoconhecimento");
  }, []);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="title">
            Título
          </Label>
          <Input
            className="text-text-700"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => {
              setFormData((current) => ({ ...current, title: e.target.value }));
            }}
          />
          {!!errors?.title && <span className="text-sm text-error-500">{errors.title}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="summary">
            Resumo
          </Label>
          <Textarea
            className="h-28 text-text-700"
            id="summary"
            name="summary"
            value={formData.summary ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, summary: e.target.value }));
            }}
          />
          {!!errors?.summary && <span className="text-sm text-error-500">{errors.summary}</span>}
        </div>
        <div className="pb-3">{!!errors?.title && <span className="text-sm text-error-500">{errors.title}</span>}</div>
        <IconField
          value={formData.icon as IconName}
          onChange={(e) => {
            setFormData((current) => ({ ...current, icon: e }));
          }}
        />
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
