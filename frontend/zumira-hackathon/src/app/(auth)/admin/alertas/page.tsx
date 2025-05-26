import { Header } from "../components/header";
import { getAssessments, getCompanies } from "./actions";
import { AlertsUI } from "./components/alerts-ui";

export default async function Alertas() {
  const assessments = await getAssessments();
  const companies = await getCompanies();

  return (
    <div className="flex flex-col gap-2">
      <Header title="Alertas" />
      <AlertsUI companies={companies} assessments={assessments} />
    </div>
  );
}
