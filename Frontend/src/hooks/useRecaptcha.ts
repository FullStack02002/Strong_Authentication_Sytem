import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";

export const useRecaptcha = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const getToken = async (action: string): Promise<string | null> => {
        if (!executeRecaptcha) {
            toast.error("reCAPTCHA not ready. Please try again.");
            return null;
        }

        try {
            //  action helps Google identify what the user is doing
            // use specific actions for better scoring
            const token = await executeRecaptcha(action);
            return token;
        } catch (error) {
            toast.error("reCAPTCHA failed. Please try again.");
            return null;
        }
    };

    return { getToken };
};