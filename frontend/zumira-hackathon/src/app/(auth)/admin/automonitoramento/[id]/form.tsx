"use client"

import { useCallback, useState } from "react"
import {
  FormErrors,
  INITIAL_VALUE,
  ManageMonitoringBlock,
  ManageMonitoringBlockSchema,
  MonitoringBlock
} from "./definitions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/custom/label"
import { Textarea } from "@/components/ui/textarea"
import { IconField } from "./components/icons"
import { IconName } from "@/components/custom/icon"
import { Button } from "@/components/ui/button"
import { saveSelfMonitoringBlock } from "./form-actions"
import { redirect } from "next/navigation"

type FormProps = {
  data: MonitoringBlock | null
}

export function SelfMonitoringBlockForm({ data }: FormProps) {
  const [formData, setFormData] = useState<ManageMonitoringBlock>(data ?? INITIAL_VALUE)
  const [errors, setErrors] = useState<FormErrors>(null)

  const [formError, setFormError] = useState<string>("")

  const handleSubmit = async () => {
    setErrors(null)
    const validation = ManageMonitoringBlockSchema.safeParse(formData)

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors)
    }

    const payload = {
      id: data?.id ?? undefined,
      ...formData
    }

    const response = await saveSelfMonitoringBlock(payload)

    if (response) {
      setFormError(response)
    }
  }

  const handleCancel = useCallback(() => {
    redirect("/admin/automonitoramento")
  }, [])

  return (
    <div className="w-full py-4 md:pt-4 md:pb-24">
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
            className="h-28"
          />
          {!!errors?.summary && <span className="text-sm text-error-500">{errors.summary}</span>}
        </div>
        <IconField
          value={formData.icon as IconName}
          onChange={e => {
            setFormData(current => (
              { ...current, icon: e }
            ))
          }}
        />
      </div>
      {!!formError && <span className="text-sm text-error-500">{formError}</span>}
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-end gap-x-3">
        <Button size="xl" variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button size="xl" variant="primary" onClick={handleSubmit}>Salvar</Button>
      </div>
    </div>
  )
}
