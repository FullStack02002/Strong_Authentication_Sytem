import { Schema, model } from "mongoose";
import type { IUserDocument } from "./user.types.js";
import bcrypt from "bcrypt"





const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            trim: true,
            select: false
        }
    },
    {
        timestamps: true
    }
)

// funciton to hash password

userSchema.pre("save", async function (this: IUserDocument) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password as string, 10);
});

userSchema.methods.comparePassword = async function (this: IUserDocument, enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password as string)
}



export const User = model<IUserDocument>("User", userSchema)