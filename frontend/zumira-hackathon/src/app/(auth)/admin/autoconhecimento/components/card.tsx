import Link from "next/link";

import { CustomIcon, IconName } from "@/components/custom/icon";

type CardProps = {
  id: string;
  title: string;
  summary: string | undefined;
  icon: IconName | undefined;
};

export function Card({ id, title, summary, icon }: CardProps) {
  return (
    <Link className="p-[1.375rem] rounded-xl bg-background-100" href={`/admin/autoconhecimento/${id}`}>
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center">
          {!!icon && <CustomIcon className="size-6 text-text-700" name={icon as IconName} />}
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-medium text-text-700 mb-3">{title}</h3>
        <p className="w-full h-14 overflow-hidden text-ellipsis text-xs font-normal text-text-900">{summary}</p>
      </div>
    </Link>
  );
}
