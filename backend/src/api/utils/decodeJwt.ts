import { Response } from "express"
import jwt from "jsonwebtoken"

interface JwtSchema {
  data: {
    id: string
    email: string
  }
  iat: number
  exp: number
}

export default function decodeJwt(token: string) {
  const getToken = token?.replace("Bearer", "").trim() as string

  try {
    const decodedJwt = jwt.verify(
      getToken,
      process.env.JWT_SECRET as string
    ) as JwtSchema

    return decodedJwt
  } catch {
    throw new Error("Invalid JWT.")
  }
}
