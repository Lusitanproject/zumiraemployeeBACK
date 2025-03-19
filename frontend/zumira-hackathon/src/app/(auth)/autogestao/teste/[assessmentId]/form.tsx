import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AssessmentDetail } from "./definitions"

type AssessmentFormProps = {
  data: AssessmentDetail
}

export function AssessmentForm({ data }: AssessmentFormProps) {
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col pt-4 pb-8 border-b border-gray-200">
        <h2 className="text-2xl text-gray-700 font-medium mb-8">{data.title}</h2>
        {!!data.description && <p className="text-base leading-6 text-gray-600">{data.description}</p>}
      </div>

      <form>
        {data.assessmensQuestions.map((item, index) => (
          <div
            key={item.id}
            className="w-full mb-4 pb-4 border-b border-gray-100 py-6"
          >
            <p className="font-medium text-gray-700 mb-3">
              <span className="font-bold text-gray-700">{index + 1}.</span> {item.description}
            </p>
            <div className="flex flex-col pl-4">
              <RadioGroup>
                {item.assessmentQuestionChoices?.map(choice => (
                  <div className="flex items-center gap-x-3" key={choice.id}>
                    <RadioGroupItem value={`${choice.value}`} id={choice.id} />
                    <label htmlFor={choice.id}>{choice.label}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ))}
      </form>
    </div>
  )
}
