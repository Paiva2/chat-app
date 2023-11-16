import { Request, Response } from "express"
import RegisterNewUserService from "../services/registerNewUserService"
import { ErrorHandling } from "../@types/types"
import UserModel from "../model/User.model"

export default class RegisterNewUserController {
  static async handle(req: Request, res: Response) {
    const { username, email, password, passwordConfirmation } = req.body

    const userModel = new UserModel()

    const registerNewUserService = new RegisterNewUserService(userModel)

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
