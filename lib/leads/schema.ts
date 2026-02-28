import { z } from "zod";

const phoneRegex = /^[+()\-\d\s]{7,24}$/;

export const leadCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .refine((value) => phoneRegex.test(value), {
      message: "Teléfono inválido",
    }),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || z.email().safeParse(value).success, {
      message: "Correo inválido",
    }),
  message: z.string().trim().min(8).max(1500),
  source: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
