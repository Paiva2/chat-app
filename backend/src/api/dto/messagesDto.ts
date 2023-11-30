import { z } from "zod"

export const insertNewPrivateMessageDto = z.object({
  message: z.string().min(1, { message: "Message can't be empty." }),
  sendToId: z.string().min(1, { message: "SendToId can't be empty." }),
  sendToUsername: z.string().min(1, { message: "SendToUsername can't be empty." }),
  time: z.string(),
  type: z.enum(["private-message"]),
  userId: z.string().min(1, { message: "userId can't be empty." }),
  userProfilePic: z.string(),
  username: z.string().min(1, { message: "Username can't be empty." }),
})
