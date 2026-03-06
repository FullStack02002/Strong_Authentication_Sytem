export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}


export interface UpdateUserDTO extends Partial<CreateUserDTO> { }


export interface UserResponseDTO {
    _id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}


export const toUserResponseDTO = (user: any): UserResponseDTO => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});