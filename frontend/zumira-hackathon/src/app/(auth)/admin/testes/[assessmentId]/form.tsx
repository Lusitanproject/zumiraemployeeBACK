"use client"

import { useState } from "react"
import {
  Assessment,
  CreateAssessmentSchema,
  FormErrors,
  INITIAL_VALUE,
  ManageAssessment
} from "./definitions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/custom/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type FormProps = {
  data: Assessment | null
}

export function AssessmentForm({ data }: FormProps) {
  const [formData, setFormData] = useState<ManageAssessment>(data ?? INITIAL_VALUE)
  const [errors, setErrors] = useState<FormErrors>(null)

  const handleSubmit = () => {
    setErrors(null)
    const validation = CreateAssessmentSchema.safeParse(formData)

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors)
    }

    const payload = {
      ...(data ? { id: data.id } : {}),
      ...formData
    }

    console.log(payload)
  }

  return (
    <div className="w-full py-4">
      <div className="w-full md:w-[30rem]">
        <div className="pb-3">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={e => {
              setFormData(current => (
                { ...current, title: e.target.value }
              ))
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
            onChange={e => {
              setFormData(current => (
                { ...current, summary: e.target.value }
              ))
            }}
            className="h-20"
          />
          {!!errors?.summary && <span className="text-sm text-error-500">{errors.summary}</span>}
        </div>
        <div className="pb-3">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={e => {
              setFormData(current => (
                { ...current, description: e.target.value }
              ))
            }}
            className="h-20"
          />
          {!!errors?.description && <span className="text-sm text-error-500">{errors.description}</span>}
        </div>

      </div>
      <Button size="xl" variant="primary" onClick={handleSubmit}>Salvar</Button>
    </div>
  )
}
