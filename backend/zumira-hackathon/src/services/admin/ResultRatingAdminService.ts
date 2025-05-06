import { z } from "zod";
import prismaClient from "../../prisma";
import { CreateResultRatingSchema, EditResultRatingSchema } from "../../definitions/admin/result-rating";

type CreateResultRating = z.infer<typeof CreateResultRatingSchema>;
type EditResultRating = z.infer<typeof EditResultRatingSchema>;

class ResultRatingAdminService {
  async create(data: CreateResultRating) {
    const exists = await prismaClient.resultRating.findFirst({
      where: { ...data },
    });
    if (exists) throw new Error("Rating already exists");

    const rating = await prismaClient.resultRating.create({ data });
    return rating;
  }

  async edit(data: EditResultRating) {
    const rating = await prismaClient.resultRating.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });
    return rating;
  }

  async findAll() {
    const ratings = await prismaClient.resultRating.findMany();
    return { items: ratings };
  }
}

export { ResultRatingAdminService };
