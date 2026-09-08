import { z } from "zod";
import { CANTONS } from "@/lib/cantons";

const cantonCodes = CANTONS.map((c) => c.code) as [string, ...string[]];

export const registerCustomerSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen ein."),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen haben."),
  phone: z.string().optional(),
  canton: z.enum(cantonCodes, { message: "Bitte wähle einen Kanton." }),
  plz: z.string().min(4, "Bitte gib eine gültige PLZ ein.").max(4),
  city: z.string().min(2, "Bitte gib deinen Wohnort ein."),
});

export const registerCraftsmanSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen ein."),
  companyName: z.string().min(2, "Bitte gib deinen Firmennamen ein."),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen haben."),
  phone: z.string().optional(),
  canton: z.enum(cantonCodes, { message: "Bitte wähle einen Kanton." }),
  plz: z.string().min(4, "Bitte gib eine gültige PLZ ein.").max(4),
  city: z.string().min(2, "Bitte gib deinen Standort ein."),
  categories: z.array(z.string()).min(1, "Bitte wähle mindestens ein Gewerk."),
  serviceAreas: z.array(z.enum(cantonCodes)).min(1, "Bitte wähle mindestens einen Einsatzkanton."),
  yearsExperience: z.coerce.number().int().min(0).max(60).optional(),
  bio: z.string().max(2000).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

export const postJobSchema = z.object({
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen haben.").max(120),
  categoryId: z.string().min(1, "Bitte wähle eine Kategorie."),
  description: z.string().min(20, "Bitte beschreibe deinen Auftrag genauer (mind. 20 Zeichen)."),
  canton: z.enum(cantonCodes, { message: "Bitte wähle einen Kanton." }),
  plz: z.string().min(4).max(4),
  city: z.string().min(2),
  budgetMin: z.coerce.number().nonnegative().optional(),
  budgetMax: z.coerce.number().nonnegative().optional(),
  desiredDate: z.string().optional(),
});

export const submitOfferSchema = z.object({
  jobId: z.string().min(1),
  price: z.coerce.number().positive("Bitte gib einen gültigen Preis ein."),
  message: z.string().min(10, "Bitte beschreibe dein Angebot genauer."),
  estimatedDuration: z.string().optional(),
});

export const reviewSchema = z.object({
  jobId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const editProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  bio: z.string().max(2000).optional(),
  yearsExperience: z.coerce.number().int().min(0).max(60).optional(),
  website: z.string().url("Bitte gib eine gültige URL ein.").optional().or(z.literal("")),
  categories: z.array(z.string()).min(1, "Bitte wähle mindestens ein Gewerk."),
  serviceAreas: z.array(z.enum(cantonCodes)).min(1, "Bitte wähle mindestens einen Einsatzkanton."),
});
