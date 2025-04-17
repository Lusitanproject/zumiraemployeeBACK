"use client";

import { useCallback, useState } from "react";

import {
  AssessmentSummary,
  CreateAssessmentSchema,
  FormErrors,
  INITIAL_VALUE,
  ManageAssessment,
  MonitoringBlock,
} from "./definitions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirect } from "next/navigation";
import { saveAssessment } from "./form-actions";
import { Nationality } from "../../autoconhecimento/definitions";
import { RichTextArea } from "@/components/ui/rich-text-area";

type FormProps = {
  data: AssessmentSummary | null;
  blocks: MonitoringBlock[];
  nationalities: Nationality[];
};

export function AssessmentForm({ data, blocks, nationalities }: FormProps) {
  const parsedData: ManageAssessment | null = data
    ? {
        title: data.title,
        summary: data.summary,
        description: data.description,
        selfMonitoringBlockId: data.selfMonitoringBlockId,
        openaiAssistantId: data.openaiAssistantId,
        operationType: data.operationType,
        nationalityId: data.nationalityId,
      }
    : null;

  const [formData, setFormData] = useState<ManageAssessment>(parsedData ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);

  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    setErrors(null);
    const validation = CreateAssessmentSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
    }

    const payload = {
      ...(data ? { id: data.id } : {}),
      ...formData,
    };

    const response = await saveAssessment(payload);

    if (response) {
      setFormError(response);
    }
  };

  const handleCancel = useCallback(() => {
    redirect("/admin/testes");
  }, []);

  const handleMoveToQuestions = useCallback(() => {
    if (data?.id) {
      redirect(`/admin/testes/${data.id}/perguntas`);
    }
  }, [data]);

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="title">Título</Label>
          <Input
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
          <Label htmlFor="summary">Resumo</Label>
          <Textarea
            id="summary"
            name="summary"
            value={formData.summary ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, summary: e.target.value }));
            }}
            className="h-20"
          />
          {!!errors?.summary && <span className="text-sm text-error-500">{errors.summary}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="description">Descrição</Label>
          <RichTextArea
            id="description"
            value={formData.description ?? ""}
            onChange={(value) => {
              setFormData((current) => ({ ...current, description: value }));
            }}
          />
          {!!errors?.description && <span className="text-sm text-error-500">{errors.description}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="nationality">Nacionalidade</Label>
          <Select
            name="nationality"
            defaultValue={formData.nationalityId}
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                nationalityId: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((n) => (
                <SelectItem key={n.id} value={n.id}>
                  {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.nationalityId && <span className="text-sm text-error-500">{errors.nationalityId}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="assistantId">ID do assistente OpenAi</Label>
          <Input
            id="assistantId"
            name="assistantId"
            value={formData.openaiAssistantId ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, openaiAssistantId: e.target.value }));
            }}
          />
        </div>
        <div className="pb-3 flex flex-row gap-10">
          <div>
            <Label htmlFor="selfMonitoringBlockId">Bloco de Autoconhecimento</Label>
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
          <div>
            <Label htmlFor="operation">Tipo de operação</Label>
            <Select
              name="operation"
              defaultValue={data?.operationType || "AVERAGE"}
              onValueChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  operationType: value === "AVERAGE" || value === "SUM" ? value : "AVERAGE",
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"AVERAGE"}>Média</SelectItem>
                <SelectItem value={"SUM"}>Soma</SelectItem>
              </SelectContent>
            </Select>
            {!!errors?.operationType && <span className="text-sm text-error-500">{errors.operationType}</span>}
          </div>
        </div>
        {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      </div>
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-end gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        {data?.id && (
          <Button size="xl" variant="secondary" onClick={handleMoveToQuestions}>
            Cadastrar perguntas
          </Button>
        )}
        <Button size="xl" variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
