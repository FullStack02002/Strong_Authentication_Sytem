import dotenv from "dotenv"
dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI as string,
    DB_NAME: process.env.DB_NAME as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    NODE_ENV: process.env.NODE_ENV as string || "development",
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string
}