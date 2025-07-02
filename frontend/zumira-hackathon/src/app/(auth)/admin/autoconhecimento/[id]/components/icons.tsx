import { CustomIcon, IconName, ICONS } from "@/components/custom/icon";
import { Label } from "@/components/custom/label";
import { cn } from "@/lib/utils";

export type IconFieldProps = {
  value: IconName | null;
  onChange: (value: IconName) => void;
};

export function IconField({ value, onChange }: IconFieldProps) {
  return (
    <div className="pb-3">
      <Label>Ícone</Label>
      <div className="flex flex-wrap gap-2 border border-border-300 rounded-xl p-2 w-full max-w-[202px]">
        {ICONS.map((icon) => (
          <button
            key={icon}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg bg-background-100 border border-border-100",
              {
                "bg-primary-25 border border-primary-50": value === icon,
              }
            )}
            onClick={() => onChange(icon)}
          >
            <CustomIcon className="size-5" name={icon} />
          </button>
        ))}
      </div>
    </div>
  );
}
