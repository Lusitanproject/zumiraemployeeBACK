import { getAssessmentData } from "./actions";
import { AssessmentForm } from "./form";

export default async function Questionario({ params }: {  params: Promise<{ assessmentId: string }> }){
  const { assessmentId } = await params
  const assessment = await getAssessmentData(assessmentId)

  if(assessment.status === "ERROR") {
    return <></>
  }

  if(assessment.status === "COMPLETED") {
    return <></>
  }

  return (
    <AssessmentForm data={assessment.data} />
  )
}
