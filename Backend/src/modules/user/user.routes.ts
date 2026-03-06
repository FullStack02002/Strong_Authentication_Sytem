import { Router } from "express";
import { createUserSchema, updateUserSchema, verifyEmailSchema, resendVerificationSchema } from "./user.validation.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
    registerUser, getAllUsers, getById, deleteUser,
    updateUser, verifyEmail, resendVerification
} from "./user.controller.js";


const router = Router();


// Auth Routes
router.post("/register", validateRequest(createUserSchema), registerUser);
router.post("/verify-email", validateRequest(verifyEmailSchema), verifyEmail);
router.post("/resend-verify", validateRequest(resendVerificationSchema), resendVerification)



// User Routes
router.get("/", getAllUsers);
router.get("/get/:id", getById);
router.delete("/delete/:id", deleteUser);
router.patch("/update/:id", validateRequest(updateUserSchema), updateUser);

export default router;