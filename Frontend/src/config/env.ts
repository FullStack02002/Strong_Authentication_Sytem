export const env = {
    API_URL: import.meta.env.VITE_API_URL as string,
    RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY as string
} as const;