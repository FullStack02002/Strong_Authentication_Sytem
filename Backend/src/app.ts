import express from "express";
import { ApiError } from "./utils/ApiError.js";
import userRouter from "./modules/user/user.routes.js"
import { env } from "./config/env.js";
import cors from "cors"
import cookieParser from "cookie-parser";






const app = express();



const allowedOrigins = [
    env.CORS_ORIGIN_1
];

const corsOptions: cors.CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req, res) => {
    res.end("Api Running");
})



app.use("/api/users", userRouter);





app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: null,
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: [],
            data: null,
        });
    }
});


export default app;