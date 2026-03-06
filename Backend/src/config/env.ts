import dotenv from "dotenv"
dotenv.config();

export const env={
    PORT:process.env.PORT || 5000,
    MONGO_URI:process.env.MONGO_URI as string,
    DB_NAME:process.env.DB_NAME as string,
    CORS_ORIGIN_1:process.env.CORS_ORIGIN_1 as string
}