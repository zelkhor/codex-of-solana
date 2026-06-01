import { z } from 'zod';

export const PrintingSchema = z.object({
  identifier: z.string(),
  print: z.string(),
  set: z.string(),
  rarity: z.string(),
  edition: z.string().optional(),
  foiling: z.string().optional(),
  image: z.string(),
  oppositeImage: z.string().optional(),
  artists: z.array(z.string()),
});

export const CardSchema = z.object({
  cardIdentifier: z.string(),
  name: z.string(),
  pitch: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  classes: z.array(z.string()),
  talents: z.array(z.string()),
  types: z.array(z.string()),
  subtypes: z.array(z.string()),
  keywords: z.array(z.string()),
  rarity: z.string(),
  rarities: z.array(z.string()),
  sets: z.array(z.string()),
  typeText: z.string().optional(),
  cost: z.number().optional(),
  defense: z.number().optional(),
  functionalText: z.string().optional(),
  printings: z.array(PrintingSchema),
  defaultImage: z.string(),
});
