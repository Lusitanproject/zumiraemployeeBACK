import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try {
        // Validar o token
        const { sub } = verify(token, process.env.JWT_SECRET!) as Payload;

        // Recuperar o id do token e armazenar numa variavel userId dentro de req
        // @ts-ignore
        req.userId = sub;

        return next();
    } catch (err) {
        return res.status(401).end();
    }
}
