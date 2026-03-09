import { Router } from "express";
import {
    createUserSchema, updateUserSchema,
    verifyEmailSchema, resendVerificationSchema,
    loginUserSchema, verifyLoginOTPSchema, resendLoginOTPSchema
} from "./user.validation.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
    registerUser, getAllUsers, getById, deleteUser,
    updateUser, verifyEmail, resendVerification,
    loginUser, verifyLoginOTP, logoutUser, refreshToken,
    getCurrentUser, resendLoginOTP
} from "./user.controller.js";
import { verifyJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";


const router = Router();

// Auth Routes
router.post("/register", validateRequest(createUserSchema), registerUser);
router.post("/verify-email", validateRequest(verifyEmailSchema), verifyEmail);
router.post("/resend-verify", validateRequest(resendVerificationSchema), resendVerification);
router.post("/resend-otp", validateRequest(resendLoginOTPSchema), resendLoginOTP);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.post("/login/verify-otp", validateRequest(verifyLoginOTPSchema), verifyLoginOTP);
router.post("/refresh-token", refreshToken);



// Protected Routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);


// Admin routes
router.get("/", verifyJWT, authorizeRoles("admin"), getAllUsers);
router.get("/get/:id", verifyJWT, authorizeRoles("admin"), getById);
router.delete("/delete/:id", verifyJWT, authorizeRoles("admin"), deleteUser);
router.patch("/update/:id", verifyJWT, authorizeRoles("admin"), validateRequest(updateUserSchema), updateUser);

export default router;