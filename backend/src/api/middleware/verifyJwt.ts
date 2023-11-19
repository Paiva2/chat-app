import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export default function verifyJwt(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization as string

    const getToken = token?.replace("Bearer", "").trim()

    const decodedJwt = jwt.verify(getToken, process.env.JWT_SECRET as string)

    if (decodedJwt) {
      next()
    }
  } catch (e) {
    return res.status(403).send({ message: "Invalid authorization token." })
  }
}
