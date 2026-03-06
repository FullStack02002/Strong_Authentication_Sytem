import { User } from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { toUserResponseDTO, type CreateUserDTO, type UpdateUserDTO } from "./user.dto.js";
import type { IUserDocument } from "./user.types.js";

export const CreateUser = async (data: CreateUserDTO) => {

    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new ApiError(409, "Email already in use");
    }

    const user: IUserDocument = await User.create({
        name: data.name,
        email: data.email,
        password: data.password
    })

    return toUserResponseDTO(user);
}

export const getUsers = async () => {
    return User.find();
}

export const getById = async (id: string) => {

    const user = await User.findById(id).lean();

    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    return user;

}

export const deleteUser = async (id: string) => {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    return user;
}


export const updateUser = async (id: string, data: UpdateUserDTO) => {
    const user = await User.findByIdAndUpdate(
        id,
        { $set: data },
        {
            new: true,
            runValidators: true,
        }
    ).lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;

}
