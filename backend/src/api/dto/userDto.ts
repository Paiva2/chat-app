import { z } from "zod"

export const registerNewUserDto = z
  .object({
    username: z
      .string()
      .min(1, { message: "Username must have at least 3 characters." }),
    email: z.string().email({ message: "Invalid e-mail." }),
    password: z.string().min(1, { message: "Password can't be empty." }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Password confirmation can't be empty." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  })

export const authUserDto = z.object({
  email: z.string().email({ message: "Invalid e-mail." }),
  password: z.string().min(1, { message: "Password can't be empty." }),
})

export const changeUserPasswordDto = z
  .object({
    email: z.string().email({ message: "Invalid e-mail." }),
    password: z.string().min(1, { message: "Password can't be empty." }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Password confirmation can't be empty." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  })
