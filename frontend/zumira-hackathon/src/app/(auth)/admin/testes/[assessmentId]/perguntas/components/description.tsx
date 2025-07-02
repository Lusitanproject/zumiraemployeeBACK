import { ChangeEventHandler } from "react";

import { Label } from "@/components/custom/label";
import { Textarea } from "@/components/ui/textarea";

type DescriptionProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

export function Description({ value, onChange }: DescriptionProps) {
  return (
    <div className=" w-full flex flex-col gap-y-2">
      <Label className="text-text-700" htmlFor="description">
        Descrição
      </Label>
      <Textarea className="text-text-700" id="description" value={value} onChange={onChange} />
    </div>
  );
}
