import type { Request, Response, NextFunction } from "express";
import { verifyCaptcha } from "../utils/verifyCaptcha.js";
import { ApiError } from "../utils/ApiError.js";

export const validateCaptcha = (action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { captchaToken } = req.body;

            if (!captchaToken) {
                throw new ApiError(400, "Captcha token is required");
            }

            await verifyCaptcha(captchaToken, action);
            next(); 

        } catch (error) {
            next(error);
        }
    };
};