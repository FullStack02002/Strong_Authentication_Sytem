import type { Document } from "mongoose";


export interface IUser {
    name: string;
    email: string;
    password?: string
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>
}

export interface IUserResponse {
    _id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}