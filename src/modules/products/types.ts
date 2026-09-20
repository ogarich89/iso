import * as z from 'zod/mini';

export const productSchema = z.object({
  id: z.number(),
  color: z.string(),
  pantone_value: z.string(),
  year: z.number(),
  name: z.string(),
});

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
export type Products = z.infer<typeof productsSchema>;
