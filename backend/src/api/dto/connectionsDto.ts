import { z } from "zod"

export const deleteConnectionDto = z.object({
  connectionId: z.string().min(1, { message: "connectionId can't be empty." }),
})

export const handleConnectionDto = z.object({
  connections: z.string().array().length(5),
  connectionId: z.string().optional(),
})
