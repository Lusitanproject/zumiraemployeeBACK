import { getAssessmentQuestions } from "./actions";
import { AssessmentForm } from "./form";

export default async function Questionario({ params }: {  params: Promise<{ id: string }> }){
  const { id } = await params
  const assessment = await getAssessmentQuestions(id)

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-2xl text-gray-700 font-medium mb-8">{assessment.title}</h2>
      {!!assessment.description && <p className="">{assessment.description}</p>}

      <AssessmentForm data={assessment.questions} />
    </div>
  )
}
