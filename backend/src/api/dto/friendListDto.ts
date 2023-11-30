import { z } from "zod"

export const insertToFriendListDto = z.object({
  userId: z.string().min(1, { message: "User id can't be empty." }),
  userToInsert: z.object({
    id: z.string().optional(),
    username: z.string().optional(),
    profilePicture: z.string().optional(),
  }),
})

export const removeFromFriendListDto = z.object({
  friendId: z.string().min(1, { message: "Friend id can't be empty." }),
})
