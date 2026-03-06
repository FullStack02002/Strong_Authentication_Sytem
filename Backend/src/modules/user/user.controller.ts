import * as userService from "./user.service.js";
import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import type { UserResponseDTO } from "./user.dto.js";
import { toUserResponseDTO } from "./user.dto.js";
import { ApiError } from "../../utils/ApiError.js";
import { isValidObjectId } from "mongoose";


export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await userService.CreateUser({ name, email, password });
    res.status(201).json(new ApiResponse(201, user, "Registration successful. Verification link sent to your email"))
})

export const verifyEmail = asyncHandler(async(req:Request,res:Response)=>{
    const {token,email} = req.query as {token:string;email:string};
    const user = await userService.verifyEmail(email,token);
    res.status(200).json(new ApiResponse(200,user,"Email Verified Successfully"));
})

export const resendVerification = asyncHandler(async(req:Request,res:Response)=>{
    const {email} = req.body;
    const result = await userService.resendVerification(email);
    res.status(200).json(new ApiResponse(200,result,"Verification email sent"))
})



export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getUsers();

    const response: UserResponseDTO[] = users.map(toUserResponseDTO);

    res.status(200).json(new ApiResponse(200, response, "All Users Fetched Successfully"))
})

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Id")
    }

    const user = await userService.getById(id);


    const response = toUserResponseDTO(user);

    return res.status(200).json(new ApiResponse(200, response, "User Fetched Successfully"))
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Id")
    }

    const user = await userService.deleteUser(id);

    const response = toUserResponseDTO(user);

    return res.status(200).json(new ApiResponse(200, response, "User Deleted Successfully"))
})

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const data = req.body

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Id")
    }

    const updatedUser = await userService.updateUser(id, data);

    const response = toUserResponseDTO(updatedUser);

    return res.status(200).json(new ApiResponse(200, response, "User updated Successfully"));

})






