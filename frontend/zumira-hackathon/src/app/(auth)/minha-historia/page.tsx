import { Download } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

import { getFullStory } from "@/api/acts";
import { decrypt } from "@/app/_lib/session";
import { PDFDownloadLink } from "@/components/custom/pdf";

import { BookDocument } from "./components/BookDocument";

export default async function MinhaHistoria() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);
  const chapters = await getFullStory();

  return (
    <div className="flex size-full justify-end p-2 md:p-4">
      <div className="flex flex-col h-full w-fit max-w-full items-center gap-4">
        <div
          className={"flex flex-col p-16 h-9/10 aspect-[0.705] items-center justify-between bg-[#262626] text-white"}
        >
          <div className={"text-sm italic"}>
            <span>{session?.name}</span>
          </div>
          <div className={"flex flex-col gap-4"}>
            <span className={"text-4xl md:text-6xl font-bold"}>
              EU, EU MESM{session?.gender === "FEMALE" ? "A" : "O"} E ZUMIRA
            </span>
            <span className={"text-sm md:text-base leading-tight"}>
              Descubra como transformar a sua história em uma obra literária de cura e inspiração.
            </span>
          </div>
          <Image alt="Icon Zumira" height={30} src="/icon-green.png" width={30} />
        </div>

        <PDFDownloadLink
          className="flex flex-row size-fit gap-2 text-text-25 px-4 py-1 bg-primary-500 rounded-full items-center"
          document={
            <BookDocument data={chapters} gender={session?.gender ?? "OTHER"} username={session?.name ?? "Usuário"} />
          }
          fileName="Minha história por Zumira"
        >
          <Download className="size-4.5" />
          <span className="font-semibold">Baixar</span>
        </PDFDownloadLink>
      </div>
    </div>
  );
}
