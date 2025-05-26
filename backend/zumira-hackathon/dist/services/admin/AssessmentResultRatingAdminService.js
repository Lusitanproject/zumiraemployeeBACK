"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultRatingAdminService = void 0;
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const prisma_1 = __importDefault(require("../../prisma"));
class AssessmentResultRatingAdminService {
    async findByAssessment(assessmentId) {
        const ratings = await prisma_1.default.assessmentResultRating.findMany({
            where: { assessmentId },
            select: {
                id: true,
                risk: true,
                profile: true,
                color: true,
            },
        });
        return { items: ratings };
    }
    async updateAssessmentResultRatings(data) {
        const assessment = await prisma_1.default.assessment.findFirst({
            where: { id: data.assessmentId },
            include: { assessmentResultRatings: true },
        });
        if (!assessment)
            throw new Error("Assessment does not exist");
        const newRatings = data.ratings.filter((r) => !r.id);
        const deletedRatings = assessment.assessmentResultRatings.filter((r1) => !data.ratings.some((r2) => r1.id === r2.id));
        const updatedRatings = data.ratings.filter((r1) => {
            if (!r1.id)
                return false;
            const r2 = assessment.assessmentResultRatings.find((r2) => r1.id === r2.id);
            return r2 && !(0, fast_deep_equal_1.default)(r1, r2);
        });
        await Promise.all([
            prisma_1.default.assessmentResultRating.createMany({
                data: newRatings.map((r) => ({
                    risk: r.risk,
                    profile: r.profile,
                    color: r.color,
                    assessmentId: data.assessmentId,
                })),
            }),
            prisma_1.default.assessmentResultRating.deleteMany({
                where: {
                    id: {
                        in: deletedRatings.map((r) => r.id),
                    },
                },
            }),
            ...updatedRatings.map((r) => prisma_1.default.assessmentResultRating.update({
                where: {
                    id: r.id,
                },
                data: { risk: r.risk, profile: r.profile, color: r.color },
            })),
        ]);
        return {};
    }
}
exports.AssessmentResultRatingAdminService = AssessmentResultRatingAdminService;
