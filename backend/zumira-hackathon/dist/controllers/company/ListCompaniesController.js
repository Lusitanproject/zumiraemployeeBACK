"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompaniesController = void 0;
const assertPermissions_1 = require("../../utils/assertPermissions");
const ListCompaniesService_1 = require("../../services/company/ListCompaniesService");
class ListCompaniesController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "read-companies");
        const listCompanies = new ListCompaniesService_1.ListCompaniesService();
        const companies = await listCompanies.execute();
        return res.json({ status: "SUCCESS", data: companies });
    }
}
exports.ListCompaniesController = ListCompaniesController;
