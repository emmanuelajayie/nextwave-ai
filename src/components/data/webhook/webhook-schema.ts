import { z } from "zod";

export const webhookFormSchema = z.object({
  webhookUrl: z.string().url("Please enter a valid webhook URL"),
  name: z.string().min(1, "Name is required"),
});

export type WebhookFormValues = z.infer<typeof webhookFormSchema>;