import { Request } from "express";

export function assertPermissions(user: Request["user"], permissions: string[] | string) {
    if (!user) {
        throw new Error("No user provided");
    }

    if (typeof permissions === "string") {
        permissions = [permissions];
    }

    const missingPermissions = permissions.filter((p) => !user.permissions.includes(p));

    if (missingPermissions.length > 0) {
        throw new Error(`User does not have the required permissions: ${missingPermissions.join(", ")}`);
    }
}
