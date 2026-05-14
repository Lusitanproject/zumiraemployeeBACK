"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const argon2_1 = require("argon2");
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class UserService {
    async create({ password, ...data }) {
        const userExists = await prisma_1.default.user.findFirst({ where: { email: data.email } });
        if (userExists)
            throw new error_1.PublicError("Usuário já existe");
        const role = await prisma_1.default.role.findFirst({ where: { slug: "user" } });
        if (!role)
            throw new Error("Cargo usuario não encontrado");
        const firstAct = await prisma_1.default.actChatbot.findFirst({ orderBy: { index: "asc" } });
        const passwordHash = password ? await (0, argon2_1.hash)(password) : null;
        const user = await prisma_1.default.user.create({
            data: {
                ...data,
                password: passwordHash,
                roleId: role.id,
                currentActChatbotId: firstAct === null || firstAct === void 0 ? void 0 : firstAct.id,
            },
        });
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async find(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            include: {
                company: { select: { id: true, name: true } },
                role: { select: { id: true, slug: true } },
            },
        });
        if (!user)
            return null;
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async findBy({ id, email, customId, phoneNumber }) {
        const user = await prisma_1.default.user.findFirst({
            where: { id, email, customId, phoneNumber },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async findAll() {
        const users = await prisma_1.default.user.findMany({
            include: {
                company: { select: { id: true, name: true } },
                role: { select: { id: true, slug: true } },
            },
        });
        return users.map((user) => {
            const { password: _password, ...response } = user;
            return { ...response };
        });
    }
    async findByEmail(email) {
        const user = await prisma_1.default.user.findFirst({
            where: { email },
            include: {
                company: { select: { id: true, name: true } },
                role: { select: { id: true, slug: true } },
            },
        });
        if (!user)
            return null;
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async findByCompany(companyId) {
        const users = await prisma_1.default.user.findMany({
            where: { companyId },
            include: {
                company: { select: { id: true, name: true } },
                role: { select: { id: true, slug: true } },
            },
        });
        return users.map((user) => {
            const { password: _password, ...response } = user;
            return { ...response };
        });
    }
    async getFilters(columns, userIds) {
        const result = {};
        const idFilter = userIds ? { id: { in: userIds } } : {};
        const SCALAR_COLUMNS = [
            "gender",
            "occupation",
            "occupationLevel",
            "area",
            "similarExposureGroup",
            "location",
            "skinColor",
            "hasDisability",
        ];
        await Promise.all(columns.map(async (col) => {
            if (SCALAR_COLUMNS.includes(col)) {
                const rows = await prisma_1.default.user.findMany({
                    select: { [col]: true },
                    distinct: [col],
                    where: { ...idFilter, [col]: { not: null } },
                    orderBy: { [col]: "asc" },
                });
                result[col] = rows.map((r) => r[col]);
            }
            else if (col === "roleId") {
                const rows = await prisma_1.default.user.findMany({
                    select: { role: { select: { id: true, slug: true } } },
                    distinct: ["roleId"],
                    where: idFilter,
                    orderBy: { role: { slug: "asc" } },
                });
                result[col] = rows.map((r) => r.role);
            }
            else if (col === "companyId") {
                const rows = await prisma_1.default.user.findMany({
                    select: { company: { select: { id: true, name: true } } },
                    distinct: ["companyId"],
                    where: { ...idFilter, companyId: { not: null } },
                    orderBy: { company: { name: "asc" } },
                });
                result[col] = rows.map((r) => r.company);
            }
            else if (col === "nationalityId") {
                const rows = await prisma_1.default.user.findMany({
                    select: { nationality: { select: { id: true, name: true } } },
                    distinct: ["nationalityId"],
                    where: { ...idFilter, nationalityId: { not: null } },
                    orderBy: { nationality: { name: "asc" } },
                });
                result[col] = rows.map((r) => r.nationality);
            }
        }));
        return result;
    }
    async search({ page, pageSize, search, companyId, roleId, gender, occupation, occupationLevel, area, similarExposureGroup, location, skinColor, hasDisability, nationalityId, }) {
        const where = {
            ...(companyId && { companyId }),
            ...(roleId && { roleId }),
            ...(gender && { gender }),
            ...(occupation && { occupation: { contains: occupation, mode: "insensitive" } }),
            ...(occupationLevel && { occupationLevel: { contains: occupationLevel, mode: "insensitive" } }),
            ...(area && { area: { contains: area, mode: "insensitive" } }),
            ...(similarExposureGroup && { similarExposureGroup: { contains: similarExposureGroup, mode: "insensitive" } }),
            ...(location && { location: { contains: location, mode: "insensitive" } }),
            ...(skinColor && { skinColor: { contains: skinColor, mode: "insensitive" } }),
            ...(hasDisability !== undefined && { hasDisability }),
            ...(nationalityId && { nationalityId }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }),
        };
        const skip = (page - 1) * pageSize;
        const [total, rawUsers] = await prisma_1.default.$transaction([
            prisma_1.default.user.count({ where }),
            prisma_1.default.user.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    company: { select: { id: true, name: true } },
                    role: { select: { id: true, slug: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);
        const users = rawUsers.map(({ password: _p, ...u }) => u);
        return {
            users,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async update({ id, ...data }) {
        const user = await prisma_1.default.user.update({
            where: { id },
            data,
        });
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async delete(id) {
        await prisma_1.default.user.delete({ where: { id } });
    }
    // ─── Sync engine ───────────────────────────────────────────────────────────
    async planSync(companyId, items) {
        var _a, _b, _c, _d;
        const errors = [];
        const conflicts = [];
        // Step 1: detect duplicate customIds in payload
        const seen = new Map();
        for (const item of items)
            seen.set(item.customId, ((_a = seen.get(item.customId)) !== null && _a !== void 0 ? _a : 0) + 1);
        const payloadDuplicates = new Set();
        for (const [id, count] of seen)
            if (count > 1)
                payloadDuplicates.add(id);
        const validItems = items.filter((item) => {
            if (payloadDuplicates.has(item.customId)) {
                if (!errors.some((e) => e.customId === item.customId)) {
                    errors.push({ customId: item.customId, field: "customId", message: "customId duplicado no payload" });
                }
                return false;
            }
            return true;
        });
        if (validItems.length === 0) {
            return { creates: [], updates: [], unchanged: [], conflicts, errors };
        }
        // Step 2: batch DB lookups
        const validCustomIds = validItems.map((i) => i.customId);
        const validEmails = validItems.map((i) => i.email);
        const selectFields = {
            id: true, customId: true, companyId: true,
            email: true, name: true, phoneNumber: true,
            occupation: true, occupationLevel: true, area: true,
            similarExposureGroup: true, location: true, skinColor: true,
            hasDisability: true, birthdate: true, admissionDate: true,
            gender: true, nationalityId: true,
        };
        const [byCustomId, byEmail] = await Promise.all([
            prisma_1.default.user.findMany({ where: { customId: { in: validCustomIds }, companyId }, select: selectFields }),
            prisma_1.default.user.findMany({ where: { email: { in: validEmails } }, select: { id: true, email: true, customId: true, companyId: true } }),
        ]);
        const customIdMap = new Map();
        for (const u of byCustomId) {
            if (!u.customId)
                continue;
            const arr = (_b = customIdMap.get(u.customId)) !== null && _b !== void 0 ? _b : [];
            arr.push(u);
            customIdMap.set(u.customId, arr);
        }
        const emailMap = new Map();
        for (const u of byEmail)
            emailMap.set(u.email, u);
        // Step 3: classify
        const creates = [];
        const updates = [];
        const unchanged = [];
        const DIFFABLE_FIELDS = [
            "email", "name", "phoneNumber", "occupation", "occupationLevel",
            "area", "similarExposureGroup", "location", "skinColor", "hasDisability",
            "birthdate", "admissionDate", "gender", "nationalityId",
        ];
        const normalizeDate = (v) => v instanceof Date ? v.toISOString() : v;
        for (const item of validItems) {
            const candidates = (_c = customIdMap.get(item.customId)) !== null && _c !== void 0 ? _c : [];
            const emailMatch = emailMap.get(item.email);
            if (candidates.length > 1) {
                conflicts.push({ type: "CUSTOM_ID_DUPLICATED_IN_DB", customId: item.customId, email: item.email });
                continue;
            }
            const candidate = (_d = candidates[0]) !== null && _d !== void 0 ? _d : null;
            if (emailMatch && candidate && emailMatch.id !== candidate.id) {
                conflicts.push({ type: "EMAIL_ALREADY_USED", customId: item.customId, email: item.email, conflictingUserId: emailMatch.id });
                continue;
            }
            if (emailMatch && !candidate) {
                conflicts.push({ type: "EMAIL_ALREADY_USED", customId: item.customId, email: item.email, conflictingUserId: emailMatch.id });
                continue;
            }
            if (candidate) {
                const changes = {};
                for (const field of DIFFABLE_FIELDS) {
                    const toRaw = item[field];
                    if (toRaw === undefined)
                        continue;
                    const fromRaw = candidate[field];
                    const from = normalizeDate(fromRaw);
                    const to = normalizeDate(toRaw);
                    if (from !== to)
                        changes[field] = { from, to };
                }
                if (Object.keys(changes).length > 0) {
                    updates.push({ customId: item.customId, userId: candidate.id, changes });
                }
                else {
                    unchanged.push({ customId: item.customId, userId: candidate.id });
                }
            }
            else {
                const { customId, ...data } = item;
                creates.push({ customId, data });
            }
        }
        return { creates, updates, unchanged, conflicts, errors };
    }
    async previewSync(companyId, items) {
        const plan = await this.planSync(companyId, items);
        return {
            summary: {
                received: items.length,
                toCreate: plan.creates.length,
                toUpdate: plan.updates.length,
                unchanged: plan.unchanged.length,
                conflicts: plan.conflicts.length,
                errors: plan.errors.length,
            },
            ...plan,
        };
    }
    async executeSync(companyId, items) {
        const plan = await this.planSync(companyId, items);
        const failed = [
            ...plan.conflicts.map((c) => ({ customId: c.customId, reason: c.type })),
            ...plan.errors.map((e) => ({ customId: e.customId, reason: e.message })),
        ];
        const unchanged = plan.unchanged.map((u) => ({ customId: u.customId, userId: u.userId }));
        const [role, firstAct] = await Promise.all([
            prisma_1.default.role.findFirst({ where: { NOT: { slug: "admin" } } }),
            prisma_1.default.actChatbot.findFirst({ orderBy: { index: "asc" } }),
        ]);
        if (!role)
            throw new Error("Nenhum cargo não-admin encontrado");
        const created = [];
        for (const op of plan.creates) {
            try {
                const user = await prisma_1.default.user.create({
                    data: { ...op.data, customId: op.customId, companyId, roleId: role.id, currentActChatbotId: firstAct === null || firstAct === void 0 ? void 0 : firstAct.id },
                });
                created.push({ customId: op.customId, userId: user.id });
            }
            catch (err) {
                failed.push({ customId: op.customId, reason: err instanceof Error ? err.message : "Erro desconhecido" });
            }
        }
        const updated = [];
        for (const op of plan.updates) {
            try {
                const data = Object.fromEntries(Object.entries(op.changes).map(([k, v]) => [k, v.to]));
                await prisma_1.default.user.update({ where: { id: op.userId }, data });
                updated.push({ customId: op.customId, userId: op.userId });
            }
            catch (err) {
                failed.push({ customId: op.customId, reason: err instanceof Error ? err.message : "Erro desconhecido" });
            }
        }
        return {
            summary: { created: created.length, updated: updated.length, unchanged: unchanged.length, failed: failed.length },
            created,
            updated,
            unchanged,
            failed,
        };
    }
}
exports.UserService = UserService;
