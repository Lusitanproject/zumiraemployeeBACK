"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState } from "react";
import { toast } from "sonner";

import { Label } from "@/components/custom/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RichTextArea } from "@/components/ui/rich-text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Nationality } from "../../autoconhecimento/definitions";
import { duplicateAssessment } from "./actions";
import {
  AssessmentSummary,
  CreateAssessmentSchema,
  FormErrors,
  INITIAL_VALUE,
  ManageAssessment,
  MonitoringBlock,
} from "./definitions";
import { saveAssessment } from "./form-actions";

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
        userFeedbackInstructions: data.userFeedbackInstructions,
        companyFeedbackInstructions: data.companyFeedbackInstructions,
        operationType: data.operationType,
        nationalityId: data.nationalityId,
        public: data.public,
      }
    : null;

  const [formData, setFormData] = useState<ManageAssessment>(parsedData ?? INITIAL_VALUE);
  const [errors, setErrors] = useState<FormErrors>(null);
  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState<{ save: boolean; duplicate: boolean }>({ save: false, duplicate: false });

  const handleSubmit = async () => {
    setErrors(null);
    setLoading((prev) => ({ ...prev, save: true }));
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
    setLoading((prev) => ({ ...prev, save: false }));
  };

  async function handleDuplicate() {
    if (!data?.id) return;

    setLoading((prev) => ({ ...prev, duplicate: true }));

    try {
      await duplicateAssessment(data.id);
    } catch (err) {
      if (!isRedirectError(err)) {
        toast.error("Erro ao duplicar o teste");
      }
    } finally {
      setLoading((prev) => ({ ...prev, duplicate: false }));
    }
  }

  return (
    <div className="w-full h-full overflow-scroll py-4">
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
            className="h-20 text-text-700"
            id="summary"
            name="summary"
            value={formData.summary ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, summary: e.target.value }));
            }}
          />
          {!!errors?.summary && <span className="text-sm text-error-500">{errors.summary}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="description">
            Descrição
          </Label>
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
          <Label className="text-text-700" htmlFor="nationality">
            Nacionalidade
          </Label>
          <Select
            defaultValue={formData.nationalityId}
            name="nationality"
            onValueChange={(value) =>
              setFormData((current) => ({
                ...current,
                nationalityId: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px] text-text-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((n) => (
                <SelectItem key={n.id} className="text-text-700" value={n.id}>
                  {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!errors?.nationalityId && <span className="text-sm text-error-500">{errors.nationalityId}</span>}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="instructions-u">
            Instruções para IA de devolutiva individual
          </Label>
          <Textarea
            className="h-40 text-text-700"
            id="instructions-u"
            name="instructions-u"
            value={formData.userFeedbackInstructions ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, userFeedbackInstructions: e.target.value }));
            }}
          />
          {!!errors?.userFeedbackInstructions && (
            <span className="text-sm text-error-500">{errors.userFeedbackInstructions}</span>
          )}
        </div>
        <div className="pb-3">
          <Label className="text-text-700" htmlFor="instructions-g">
            Instruções para IA de devolutiva de grupo
          </Label>
          <Textarea
            className="h-40 text-text-700"
            id="instructions-g"
            name="instructions-g"
            value={formData.companyFeedbackInstructions ?? ""}
            onChange={(e) => {
              setFormData((current) => ({ ...current, companyFeedbackInstructions: e.target.value }));
            }}
          />
          {!!errors?.companyFeedbackInstructions && (
            <span className="text-sm text-error-500">{errors.companyFeedbackInstructions}</span>
          )}
        </div>
        <div className="pb-3 flex flex-row gap-10">
          <div>
            <Label className="text-text-700" htmlFor="selfMonitoringBlockId">
              Bloco de Autoconhecimento
            </Label>
            <Select
              defaultValue={formData.selfMonitoringBlockId}
              name="selfMonitoringBlockId"
              onValueChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  selfMonitoringBlockId: value,
                }))
              }
            >
              <SelectTrigger className="w-[180px] text-text-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {blocks?.map((item) => (
                  <SelectItem key={item.id} className="text-text-700" value={item.id}>
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
            <Label className="text-text-700" htmlFor="operation">
              Tipo de operação
            </Label>
            <Select
              defaultValue={data?.operationType || "AVERAGE"}
              name="operation"
              onValueChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  operationType: value === "AVERAGE" || value === "SUM" ? value : "AVERAGE",
                }))
              }
            >
              <SelectTrigger className="w-[180px] text-text-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-text-700" value={"AVERAGE"}>
                  Média
                </SelectItem>
                <SelectItem className="text-text-700" value={"SUM"}>
                  Soma
                </SelectItem>
              </SelectContent>
            </Select>
            {!!errors?.operationType && <span className="text-sm text-error-500">{errors.operationType}</span>}
          </div>
        </div>
        <div className="pl-2 pb-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.public}
              id="public"
              onChange={(e) => {
                setFormData((current) => ({ ...current, public: e.target.checked }));
              }}
            />
            <Label className="text-text-700" htmlFor="public">
              Tornar teste público
            </Label>
          </div>
          {!!errors?.public && <span className="text-sm text-error-500">{errors.public}</span>}
        </div>
        {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      </div>
      <div className="border-border-100 py-4 flex items-center gap-x-3">
        <Button disabled={loading.save} loading={loading.save} size="xl" variant="primary" onClick={handleSubmit}>
          Salvar detalhes
        </Button>
        {data?.id && (
          <Button
            disabled={loading.duplicate}
            loading={loading.duplicate}
            size="xl"
            variant="secondary"
            onClick={handleDuplicate}
          >
            Duplicar
          </Button>
        )}
      </div>
    </div>
  );
}
