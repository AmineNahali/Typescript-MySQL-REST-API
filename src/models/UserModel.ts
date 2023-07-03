import { z } from "zod";

const UserRegisterSchema = z.object({
    username: z.string().min(5),
    email: z.string().email().min(5),
    password: z.string().min(5)
});

const UserLoginSchema = z.object({
    username: z.string().min(5) || z.string().email().min(5),
    password: z.string().min(5)
});

type UserRegister = z.infer<typeof UserRegisterSchema>;
type UserLogin = z.infer<typeof UserLoginSchema>;

export const validate_UserRegisterForm = (obj: UserRegister) => {
    return UserRegisterSchema.safeParse(obj).success;
}
export const validate_UserLoginForm = (obj: UserLogin) => {
    return UserLoginSchema.safeParse(obj).success;
}