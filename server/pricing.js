// server/pricing.ts
import { z } from "zod";
// ================================
// تعريف خطط الدفع
// ================================
export const PRICING_PLANS = {
    basic: { name: "Basic", price: 1000, currency: "usd" },
    pro: { name: "Pro", price: 5000, currency: "usd" },
    enterprise: { name: "Enterprise", price: 15000, currency: "usd" },
};
// ================================
// Schema للتحقق من المدفوعات
// ================================
export const createPaymentIntentSchema = z.object({
    planId: z
        .string()
        .refine((id) => Object.keys(PRICING_PLANS).includes(id), {
        message: "Invalid planId",
    }),
});
