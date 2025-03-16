import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AssessmentQuestion } from "./_definitions"

type AssessmentFormProps = {
  data: AssessmentQuestion[]
}

export function AssessmentForm({ data }: AssessmentFormProps) {
  return (
    <form>
      {data.map((item, index) => (
        <div
          key={item.id}
          className="w-full mb-4 pb-4 border-b border-gray-100 py-6"
        >
          <p className="font-medium text-gray-700 mb-3">
            <span className="font-bold text-gray-700">{index + 1}.</span> {item.description}
          </p>
          <div className="flex flex-col pl-4">
            <RadioGroup>
              {item.choices.map(choice => (
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
  )
}
