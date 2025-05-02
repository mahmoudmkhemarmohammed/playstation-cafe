import { z } from "zod";

const addSessionSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  time: z
    .number({ invalid_type_error: "الوقت يجب أن يكون رقم" })
    .min(1, "الحد الأدنى لعدد الساعات هو 1"),
});

type TaddSessionSchema = z.infer<typeof addSessionSchema>;

export { type TaddSessionSchema, addSessionSchema };
