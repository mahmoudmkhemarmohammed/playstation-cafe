import { z } from "zod";

const addProductSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  price: z
    .number({ invalid_type_error: "السعر يجب أن يكون رقم" })
    .min(1, "الحد الأدنى للسعر 1 جنية"),
  quantity: z
    .number({ invalid_type_error: "الكمية يجب أن يكون رقم" })
    .min(1, "الحد الأدنى للسعر 1 جنية"),
});

type TaddProductSchema = z.infer<typeof addProductSchema>;

export { type TaddProductSchema, addProductSchema };
