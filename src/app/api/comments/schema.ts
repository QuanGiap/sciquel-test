import { z } from "zod";

export const commentGetSchema = z.object({
    page:z.number().optional(),
    limit:z.number().optional(),
})

export const commentPostSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    comment:z.string(),
})