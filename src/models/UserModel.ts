import { z } from "zod";

//SCHEMAS
const UserRegisterSchema = z.object({
    username: z.string().min(3),
    email: z.string().email().min(5),
    password: z.string().min(5),
    regID: z.string().min(10).max(10), // obtained with text captcha verification
    regKEY: z.string().min(10).max(10) // obtained with text captcha verification
});

const UserLoginSchema = z.object({
    username: z.string().min(3) || z.string().email().min(5),
    password: z.string().min(5)
});

//INFERRED TYPES (IF NEEDED)
type UserRegister = z.infer<typeof UserRegisterSchema>;
type UserLogin = z.infer<typeof UserLoginSchema>;

//SCHEMA VALIDATION FUNCTIONS
export const validate_UserRegisterForm = (obj: UserRegister) => {
    return UserRegisterSchema.safeParse(obj).success;
}
export const validate_UserLoginForm = (obj: UserLogin) => {
    return UserLoginSchema.safeParse(obj).success;
}

//OTHER MISC functions
export function isEmail(x: string) {
    const emailSchema = z.object({ email: z.string().email().min(5) })
    return emailSchema.safeParse({ email: x }).success;
}