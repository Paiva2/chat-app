import { Request, Response } from "express"
import { ErrorHandling } from "../../@types/types"
import Factory from "../factory"

export default class RegisterNewUserController {
  static async handle(req: Request, res: Response) {
    const { username, email, password, passwordConfirmation } = req.body

    const { registerNewUserService } = Factory.exec()

    try {
      await registerNewUserService.exec({
        username,
        email,
        password,
        passwordConfirmation,
      })

      return res.status(201).send({ message: "User successfully registered." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
