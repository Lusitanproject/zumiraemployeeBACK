"use client";

import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

import { GetFullStoryResponse } from "@/api/acts";

const tw = createTw({});

type FullStoryResponseData = Exclude<GetFullStoryResponse, { status: "ERROR" }>["data"]["chapters"];

interface BookDocumentProps {
  data: FullStoryResponseData;
  gender: "MALE" | "FEMALE" | "OTHER";
  username: string;
}

export function BookDocument({ data, username, gender }: BookDocumentProps) {
  const sortedChapters = data.toSorted(
    (a, b) =>
      a.actChatbot.index - b.actChatbot.index || new Date(a.updatedAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Document title={"Minha história por Zumira"}>
      <Page size="A5" style={tw("flex flex-col p-16 items-center justify-between bg-[#262626] text-white")}>
        <View style={tw("text-sm italic")}>
          <Text>{username}</Text>
        </View>
        <View style={tw("flex flex-col gap-4")}>
          <Text style={tw("text-7xl font-bold")}>EU, EU MESM{gender === "FEMALE" ? "A" : "O"} E ZUMIRA</Text>
          <Text style={tw("text-xl leading-tight")}>
            Descubra como transformar a sua história em uma obra literária de cura e inspiração.
          </Text>
        </View>
        <Image src="/icon-green.png" style={{ width: "2.5rem" }} />
      </Page>

      <Page size="A5" style={tw("flex flex-col p-16 items-center justify-center bg-[#F5F5EB] text-[#262626]")}>
        <View>
          <Text style={tw("text-7xl font-bold text-center")}>
            EU,{"\n"}
            EU MESM{gender === "FEMALE" ? "A" : "O"} E ZUMIRA
          </Text>
        </View>
      </Page>

      <Page size="A5" style={tw("flex flex-col p-16 items-center bg-[#F5F5EB] text-[#262626] gap-4")}>
        <View>
          <Text style={{ ...tw("text-2xl text-center mt-6"), fontFamily: "Borel" }}>SUMÁRIO</Text>
        </View>

        <View style={tw("flex flex-col gap-3 w-full text-xs")}>
          {sortedChapters.map((chapter, index) => (
            <View key={index} style={tw("flex flex-row justify-between")}>
              <Text>{chapter.title}</Text>
              <Text>{index + 1}</Text>
            </View>
          ))}
        </View>
      </Page>

      <Page size="A5" style={tw("flex flex-col p-16 items-center bg-[#F5F5EB] text-[#262626] gap-4")}>
        <View>
          <Text style={tw("text-sm text-center mt-48")}>A HISTÓRIA COMEÇA</Text>
        </View>
      </Page>

      {sortedChapters.map((chapter, index) => (
        <Page key={index} size="A5" style={tw("flex flex-col p-16 items-center bg-[#F5F5EB] text-[#262626]")}>
          <View style={tw("relative flex flex-col items-center gap-2")}>
            <Text style={tw("text-4xl text-center mt-16")}>{index + 1}</Text>
            <Text style={tw("text-sm text-center text-justify")}>
              <Text style={tw("text-4xl font-bold leading-none")}>{chapter.compilation.at(0)}</Text>
              {chapter.compilation.slice(1)}
            </Text>
          </View>
        </Page>
      ))}

      <Page size="A5" style={tw("flex flex-col p-16 items-center justify-between bg-[#56C475] text-black")}>
        <View style={tw("flex flex-col h-full justify-between")}>
          <View style={tw("flex flex-col gap-8 items-center mt-4")}>
            <Text style={{ ...tw("text-xl font-bold text-center leading-tight"), fontFamily: "Borel" }}>
              A dor não precisa do silêncio.{"\n"}E a tecnologia não precisa ser sem alma.
            </Text>
            <Text style={tw("text-sm text-center")}>
              Este livro é um convite para revisitar memórias, escutar silêncios e compreender como a escuta pode
              transformar o mundo — mesmo quando vem de uma inteligência artificial.
            </Text>
            <Text style={tw("text-sm text-center")}>
              Fabiana Borges, psicóloga e pesquisadora, costura neste relato autobiográfico a origem afetiva da Zumira:
              uma plataforma que nasceu de histórias contadas repetidamente por sua avó, e da coragem de transformar dor
              em cuidado, memória em tecnologia e afeto em método.{"\n"}
              Mais do que uma biografia, esta obra é um testemunho de como o amor pode virar código — e de como uma neta
              que escutava, sem entender, criou uma máquina que escuta para acolher.
            </Text>
          </View>
          {/* A imagem foi gerada com o fundo verde pois a biblioteca apresenta problemas ao renderizar imagens somente com a cor branca (motivo desconhecido) */}
          <Image src="/logo-white-green-bg.png" style={{ width: "5rem" }} />
        </View>
      </Page>
    </Document>
  );
}
