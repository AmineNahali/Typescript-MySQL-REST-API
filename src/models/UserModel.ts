import { array, z } from "zod";

const UserSchema = z.object({
    username: z.string().min(5),
    email: z.string().email().min(5),
    password: z.string().min(5)
});

type User = z.infer<typeof UserSchema>;

export const validateUser = (o: User) => {
    return UserSchema.safeParse(o).success;
}