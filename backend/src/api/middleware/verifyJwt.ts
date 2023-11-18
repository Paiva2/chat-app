import { NextFunction, Request, Response } from "express"
import decodeJwt from "../utils/decodeJwt"

export default function verifyJwt(req: Request, res: Response, next: NextFunction) {
  try {
    const token = decodeJwt(req.headers.authorization as string)

    if (token) {
      next()
    }
  } catch (e) {
    console.log(e, process.env.JWT_SECRET)
    return res.status(403).send({ message: "Invalid authorization token." })
  }
}
