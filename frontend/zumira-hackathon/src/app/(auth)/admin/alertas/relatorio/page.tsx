"use client";

import { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";

import { getCompanyFeedback } from "@/api/companies";
import { Spinner } from "@/components/custom/spinner";
import { AlertsContext } from "@/providers/alerts";

import { CompanyFeedback } from "../../components/assistant/definitions";

export default function Relatorio() {
  const { assessmentId, companyId } = useContext(AlertsContext);
  const [feedback, setFeedback] = useState<CompanyFeedback | null>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFeedback() {
      if (!companyId || !assessmentId) return;

      setLoading(true);
      try {
        const feedback = await getCompanyFeedback(companyId, assessmentId);
        if (feedback) {
          setFeedback(feedback);
        } else {
          setFeedback(null);
        }
      } catch (err) {
        if (err instanceof Error) throw new Error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [assessmentId, companyId]);

  if (loading)
    return (
      <span className="flex w-full mt-10 text-center justify-center text-text-500 p-1.5">
        <Spinner color="var(--color-gray-300)" size="xl" />
      </span>
    );

  if (!feedback) {
    return <span className="w-full mt-10 text-center text-text-700">Esse teste ainda não gerou nenhum relatório</span>;
  }

  return (
    <div className="flex flex-col">
      <div className="markdown prose lg:prose-xl">
        <Markdown>{feedback.text}</Markdown>
      </div>
      <hr className="text-text-200" />
      <footer className="flex w-full h-10 justify-between items-center text-base text-text-600 leading-4 font-semibold">
        <span>Relatório gerado em {new Date(feedback.createdAt).toLocaleDateString("pt-br")}</span>
        <span>Número de respondentes: {feedback.respondents}</span>
      </footer>
    </div>
  );
}
