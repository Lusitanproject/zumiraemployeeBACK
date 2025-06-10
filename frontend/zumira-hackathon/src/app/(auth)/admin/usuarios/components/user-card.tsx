import Link from "next/link";

import { User } from "../definitions";

export type CardProps = {
  data: User;
};

export function UserCard({ data }: CardProps) {
  return (
    <Link className="p-[1.375rem] rounded-xl bg-gray-100" href={`/admin/usuarios/${data.id}`}>
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center font-bold">
          {data.name
            .split(" ")
            .filter((_, index) => index < 2)
            .map((item) => item[0])}
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-700 mb-1">{data.name}</h3>
        <span className="text-sm font-medium text-gray-600 mb-3">{data.email}</span>
        {data.company && <h3 className="text-base font-semibold text-gray-700 mb-1">{data.company?.name}</h3>}
        <span className="w-fit py-1 px-2 overflow-hidden text-ellipsis text-xs font-normal text-gray-500 border border-gray-500 rounded-lg">
          {data.role?.slug}
        </span>
      </div>
    </Link>
  );
}
