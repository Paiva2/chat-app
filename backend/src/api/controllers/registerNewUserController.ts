import { Request, Response } from "express"
import RegisterNewUserService from "../services/registerNewUserService"
import { ErrorHandling } from "../@types/types"
import UserModel from "../model/User.model"

export default class RegisterNewUserController {
  static async handle(req: Request, res: Response) {
    const { username, email, password, passwordConfirmation } = req.body

    const inMemoryUser = new UserModel()

    const registerNewUserService = new RegisterNewUserService(inMemoryUser)

    try {
      await registerNewUserService.exec({
        username,
        email,
        password,
        passwordConfirmation,
      })

      return res.status(201).send({ message: "User sucessfull registered." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
