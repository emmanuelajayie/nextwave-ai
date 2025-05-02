
import { z } from "zod";

export const webhookFormSchema = z.object({
  webhookUrl: z
    .string()
    .trim()
    .min(1, "Webhook URL is required")
    .url("Please enter a valid webhook URL")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          // Ensure the protocol is either http or https
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "Webhook URL must use HTTP or HTTPS protocol",
      }
    ),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
});

export type WebhookFormValues = z.infer<typeof webhookFormSchema>;
