import prismaClient from "../../prisma";
import { UpdateSystemConfigRequest } from "../../schemas/admin/system-config";

class SystemConfigAdminService {
  async getConfig() {
    return prismaClient.systemConfig.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  async update(data: UpdateSystemConfigRequest) {
    return prismaClient.systemConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
  }
}

export default SystemConfigAdminService;
