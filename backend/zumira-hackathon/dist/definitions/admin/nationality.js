"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNationalitySchema = exports.CreateNationalitySchema = void 0;
const zod_1 = require("zod");
exports.CreateNationalitySchema = zod_1.z.object({
    acronym: zod_1.z.string().min(2).max(5),
    name: zod_1.z.string().min(2).max(100),
});
exports.UpdateNationalitySchema = exports.CreateNationalitySchema;
