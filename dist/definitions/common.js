"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdSchema = exports.PhoneNumberSchema = exports.RequestParamsIdCUID = exports.RequestParamsIdUUID = exports.DateStringSchema = exports.parseSupportedDate = void 0;
const zod_1 = require("zod");
const DDMMYYYY_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const parseDdMmYyyyDate = (value) => {
    const match = value.match(DDMMYYYY_REGEX);
    if (!match) {
        return null;
    }
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);
    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
        return null;
    }
    return parsed;
};
const parseSupportedDate = (value) => {
    const trimmedValue = value.trim();
    const ddMmYyyyDate = parseDdMmYyyyDate(trimmedValue);
    if (ddMmYyyyDate) {
        return ddMmYyyyDate;
    }
    const defaultParsedDate = new Date(trimmedValue);
    if (Number.isNaN(defaultParsedDate.getTime())) {
        return null;
    }
    return defaultParsedDate;
};
exports.parseSupportedDate = parseSupportedDate;
exports.DateStringSchema = zod_1.z.string().transform((value, context) => {
    const parsedDate = (0, exports.parseSupportedDate)(value);
    if (!parsedDate) {
        context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `Invalid date: "${value}". Use a standard date format or DD/MM/YYYY`,
        });
        return zod_1.z.NEVER;
    }
    return parsedDate;
});
exports.RequestParamsIdUUID = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.RequestParamsIdCUID = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
exports.PhoneNumberSchema = zod_1.z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => ({
    original: val,
    digits: val.replace(/\D/g, ""),
}))
    .refine(({ digits }) => /^(?:\d{2}(?:9\d{8}|\d{8})|\d{2}\d{10})$/.test(digits), ({ original }) => ({
    message: `Invalid phone number: "${original}". Must be a Brazilian phone number in one of these formats: 1143547228, 11987654321, or prefixed format like 16-1140722298`,
}))
    .transform(({ digits }) => digits);
exports.UserIdSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
