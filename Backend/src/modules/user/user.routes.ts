import { Router } from "express";
import { createUserSchema, updateUserSchema } from "./user.validation.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { createUser, getAllUsers, getById, deleteUser, updateUser } from "./user.controller.js";


const router = Router();

router.post("/register", validateRequest(createUserSchema), createUser);
router.get("/", getAllUsers);
router.get("/get/:id", getById);
router.delete("/delete/:id", deleteUser);
router.patch("/update/:id", validateRequest(updateUserSchema), updateUser);

export default router;