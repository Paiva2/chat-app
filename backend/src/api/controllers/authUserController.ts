import { Request, Response } from "express"
import UserModel from "../model/User.model"
import AuthUserService from "../services/authUserService"
import { ErrorHandling } from "../@types/types"
import jwt from "jsonwebtoken"

export default class AuthUserController {
  static async handle(req: Request, res: Response) {
    const { email, password } = req.body

    const userModel = new UserModel()

    const authUserService = new AuthUserService(userModel)

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
            email: userAuth.email,
          },
        },
        process.env.JWT_SECRET as string,
        { expiresIn: jwtExpiration }
      )

      return res
        .status(200)
        .setHeader(
          "Set-Cookie",
          `chatapp-auth=${authToken}; Path=/; Max-Age=${jwtExpiration}; SameSite=Strict; Secure`
        )
        .send()
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
