import { Label } from "@/components/custom/label"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEventHandler } from "react"

type DescriptionProps = {
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export function Description({ value, onChange }: DescriptionProps) {
  return (
    <div className=" w-full flex flex-col gap-y-2">
      <Label htmlFor="description">Descrição</Label>
      <Textarea
        id="description"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
