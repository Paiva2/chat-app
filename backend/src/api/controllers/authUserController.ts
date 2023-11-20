import { Request, Response } from "express"
import { ErrorHandling } from "../@types/types"
import jwt from "jsonwebtoken"
import Factory from "./factory"

export default class AuthUserController {
  static async handle(req: Request, res: Response) {
    const { email, password } = req.body

    const { authUserService } = Factory.exec()

    const jwtExpiration = 60 * 60 * 60 * 24 * 7 // 7 days

    try {
      const userAuth = await authUserService.exec({
        email,
        password,
      })

      const authToken = jwt.sign(
        {
          data: {
            id: userAuth.id,
            createdAt: userAuth.createdAt,
          },
        },
        process.env.JWT_SECRET as string,
        { expiresIn: jwtExpiration }
      )

      return res.status(200).send({ token: authToken })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
