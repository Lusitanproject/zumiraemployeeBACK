"use server"

import { cookies } from "next/headers";
import { AssessmentDetail } from "./_definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export async function getAssessmentQuestions(assessmentId: string): Promise<AssessmentDetail> {
  const cookie = await cookies()
  const session = decrypt(cookie.get("session")?.value)

   const [error] = await catchError(fetch(`${process.env.API_BASE_URL}/assessments/questions/${assessmentId}`, {
    headers: {
      "Content-Type": "Application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  }))

  if(error) {
    console.log(error)
  }



  // const parsed = (await response.json()) as GetAssessmentQuestions
  // return parsed.data
  const data: AssessmentDetail = {
    id: "cmkaasheiqwnxaijradsr",
    title: "Questionário sobre Burnout",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac ligula gravida, eleifend dolor at, varius augue. Cras consectetur, libero vel malesuada iaculis, nibh magna congue tellus, laoreet aliquet justo magna sed eros. Praesent et rhoncus tortor. Aenean et elit erat. Maecenas gravida mi nec sem semper ullamcorper. Proin placerat in libero sit amet ornare. Nunc sagittis et leo et lacinia. Nunc nec sem at odio ultricies facilisis. Donec orci nisl, aliquam et malesuada sit amet, malesuada id erat. Aenean fringilla vitae urna et cursus. Curabitur porttitor aliquam risus, eget ultrices tellus vehicula in. Sed convallis orci sit amet consequat cursus. Morbi viverra hendrerit velit.",
    questions: [
      {
        id: "sgreagawefa",
        description: "I feel emotionally drained by my work",
        choices: [
          { id: "12dsrmbasr", label: "Never", value: 0 },
          { id: "12dsbgfasr", label: "A Few Times per Yer", value: 1 },
          { id: "12dsrmbasr", label: "Once a Month", value: 2 },
          { id: "12dsrmbasr", label: "A Few Times per Month", value: 3 },
          { id: "12dsrmbasr", label: "Once per Week", value: 4 },
          { id: "12dsrmbasr", label: "A Few Times per Week", value: 5 },
          { id: "12dsrmbasr", label: "Every day", value: 6 },
        ]
      }
    ]

  }
  return data
}
