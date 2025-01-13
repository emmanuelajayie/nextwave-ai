import { z } from "zod";

export const crmSchema = z.object({
  name: z.string().min(1, "Integration name is required"),
  type: z.enum(["hubspot", "zoho", "salesforce", "custom"]),
  apiKey: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});

export type CRMFormData = z.infer<typeof crmSchema>;