import { z } from "zod";
import prismaClient from "../../prisma";
import { CreateCompanySchema } from "../../definitions/admin/company";

type CreateCompany = z.infer<typeof CreateCompanySchema>

class AssessmentQuestionAdminService {
  async find(assessmentQuestionId: string) {
    const question = await prismaClient.assessmentQuestion.findUnique({
      where: { id: assessmentQuestionId }
    })
    return question
  }

  async findByAssessment(assessmentId: string) {
    const questions = await prismaClient.assessmentQuestion.findMany({
      where: { assessmentId },
      select: {
        id: true,
        index: true,
        assessmentId: true,
        description: true,
        updatedAt: true,
        psychologicalDimension: {
          select: {
            id: true,
            acronym: true, 
            name: true
          }
        },
        assessmentQuestionChoices: {
          select: {
            id: true,
            index: true,
            label: true,
            value: true
          }
        }
      }
    })
    return questions
  }

  async create(data: CreateCompany) {
    const company = await prismaClient.company.create({ data })
    return company
  }
}

export { AssessmentQuestionAdminService }
