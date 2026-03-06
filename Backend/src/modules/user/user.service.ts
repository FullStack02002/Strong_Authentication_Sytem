import { User } from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { toUserResponseDTO, type CreateUserDTO, type UpdateUserDTO } from "./user.dto.js";
import type { IUserDocument } from "./user.types.js";
import { redis } from "../../config/redis.js";
import { sendVerificationEmail } from "../../config/mailer.js";
import { generateToken, hashToken } from "../../utils/token.js";


const getVerifyKey = (email: string) => `verify:${email}`;
const getResendKey = (email: string) => `resend:${email}`;



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

    // generate token 
    const rawToken = generateToken();

    // hash token and store in redis
    const hashedToken = hashToken(rawToken);
    await redis.set(getVerifyKey(data.email), hashedToken, "EX", 600);

    // send raw token to email
    await sendVerificationEmail(data.email, rawToken);

    return toUserResponseDTO(user);
}

export const verifyEmail = async (email: string, token: string) => {

    // get hashed token from Redis

    const storedHash = await redis.get(getVerifyKey(email));

    if (!storedHash) {
        throw new ApiError(400, "Verification Link expired Please Request a new one")
    }

    const incomingHash = hashToken(token)
    console.log(incomingHash);
    console.log(storedHash);


    if (incomingHash !== storedHash) {
        throw new ApiError(400, "Invalid verification token");
    }

    const user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
    );

    if (!user) throw new ApiError(404, "User not found")

    await redis.del(getVerifyKey(email));

    return toUserResponseDTO(user);
}

export const resendVerification = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    if (user.isVerified) throw new ApiError(400, "Email already verified");

    //  rate limit — max 3 resends per hour
    const resendKey = getResendKey(email);
    const attempts = await redis.incr(resendKey);

    if (attempts === 1) {
        await redis.expire(resendKey, 3600);
    }

    if (attempts > 3) {
        const ttl = await redis.ttl(resendKey);
        throw new ApiError(429, `Too many attempts. Try again in ${ttl} seconds`);
    }

    //  generate new token
    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);

    //  overwrite old token in Redis
    await redis.set(getVerifyKey(email), hashedToken, "EX", 600);

    //  send new raw token
    await sendVerificationEmail(email, rawToken);

    return { message: "Verification email sent successfully" };
};

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
