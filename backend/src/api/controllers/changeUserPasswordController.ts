import { Request, Response } from "express"
import UserModel from "../model/User.model"
import ChangeUserPasswordService from "../services/changeUserPasswordService"
import { ErrorHandling } from "../@types/types"

export default class ChangeUserPasswordControler {
  static async handle(req: Request, res: Response) {
    const { email, newPassword, confirmNewPassword } = req.body

    const userModel = new UserModel()

    const changeUserPasswordService = new ChangeUserPasswordService(userModel)

    try {
      await changeUserPasswordService.exec({
        confirmNewPassword,
        email,
        newPassword,
      })

      return res.status(204).send({ message: "Password updated successfully." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
