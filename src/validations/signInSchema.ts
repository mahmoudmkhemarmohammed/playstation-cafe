import { z } from "zod";
const signInSchema = z.object({
  email: z.string().min(1, { message: "الإيميل مطلوب" }).email(),
  password: z.string().min(8, { message: "الباسورد مطلوب" }),
});

type TsignInType = z.infer<typeof signInSchema>;

export { signInSchema, type TsignInType };