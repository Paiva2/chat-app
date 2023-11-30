import { Request, Response } from "express"
import { ErrorHandling } from "../../@types/types"
import Factory from "../factory"

export default class ChangeUserPasswordControler {
  static async handle(req: Request, res: Response) {
    const { email, newPassword, confirmNewPassword } = req.body

    const { changeUserPasswordService } = Factory.exec()

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
