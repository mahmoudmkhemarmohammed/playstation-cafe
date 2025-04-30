import { z } from "zod";

const addExtraTimeSchema = z.object({
  time: z
    .number({ invalid_type_error: "الوقت يجب أن يكون رقم" })
    .min(1, "الحد الأدنى لعدد الساعات هو 1"),
    price: z
    .number({ invalid_type_error: "السعر يجب أن يكون رقم" })
    .min(1, "السعر مطلوب"),
});

type TaddExtraTimeSchema = z.infer<typeof addExtraTimeSchema>;

export { type TaddExtraTimeSchema, addExtraTimeSchema };