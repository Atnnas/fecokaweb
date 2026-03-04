import { z } from 'zod';

export const SponsorSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100),
    logoUrl: z.string().min(1, "El logo es requerido"),
    websiteUrl: z.string().optional().or(z.literal('')),
    tier: z.enum(['gold', 'silver', 'bronze']).default('silver'),
    isActive: z.boolean().default(true),
    order: z.number().int().default(0),
    contractStart: z.union([z.string(), z.date(), z.null()]).optional().transform(val => val ? new Date(val) : null),
    contractEnd: z.union([z.string(), z.date(), z.null()]).optional().transform(val => val ? new Date(val) : null),
});

export type SponsorFormData = z.infer<typeof SponsorSchema>;
