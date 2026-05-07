"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_PERMISSIONS = void 0;
__exportStar(require("./assessment"), exports);
__exportStar(require("./users"), exports);
__exportStar(require("./roles"), exports);
__exportStar(require("./company"), exports);
const assessment_1 = require("./assessment");
const users_1 = require("./users");
const roles_1 = require("./roles");
const company_1 = require("./company");
exports.ALL_PERMISSIONS = Object.values({
    ...assessment_1.AssessmentPermissions,
    ...users_1.UserPermissions,
    ...roles_1.RolePermissions,
    ...company_1.CompanyPermissions,
});
