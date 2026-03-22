import axios from "axios";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

export const verifyCaptcha = async (
    token: string,
    action: string
): Promise<void> => {

    //  verify with Google
    const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
            params: {
                secret: env.RECAPTCHA_SECRET_KEY,
                response: token,
            },
        }
    );

    const { success, score, action: returnedAction } = response.data;


    //  verification failed
    if (!success) {
        throw new ApiError(400, "Captcha verification failed. Please try again");
    }

    //  action mismatch — token used for wrong endpoint
    if (returnedAction !== action) {
        throw new ApiError(400, "Captcha action mismatch");
    }

    //  score too low — likely bot
    if (score < env.RECAPTCHA_MIN_SCORE) {
        throw new ApiError(403, "Suspicious activity detected. Please try again");
    }
};