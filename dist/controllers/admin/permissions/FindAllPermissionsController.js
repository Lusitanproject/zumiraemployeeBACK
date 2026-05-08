"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllPermissionsController = void 0;
const permissions_1 = require("../../../permissions");
class FindAllPermissionsController {
    async handle(_req, res) {
        return res.json({ status: "SUCCESS", data: { permissions: permissions_1.ALL_PERMISSIONS } });
    }
}
exports.FindAllPermissionsController = FindAllPermissionsController;
