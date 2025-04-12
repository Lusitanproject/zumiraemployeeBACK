import { CustomIcon, IconName } from "@/components/custom/icon";

import Link from "next/link";

type CardProps = {
  id: string;
  title: string;
  summary: string | undefined;
  icon: string | undefined;
};

export function Card({ id, title, summary, icon }: CardProps) {
  return (
    <Link className="p-[1.375rem] rounded-xl bg-gray-100" href={`/autoconhecimento/${id}/devolutiva`}>
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center">
          {!!icon && <CustomIcon name={icon as IconName} className="size-6" />}
        </div>
      </div>
      <div className="flex flex-col">
        <h3
          className="text-base font-medium text-gray-700 mb-3"
          style={{ overflowWrap: "anywhere", hyphens: "auto" }}
          lang="pt-BR"
        >
          {title}
        </h3>
        <p className="w-full h-16 sm:h-12 text-ellipsis text-xs font-normal text-gray-900 line-clamp-4 sm:line-clamp-3">
          {summary}
        </p>
      </div>
    </Link>
  );
}
