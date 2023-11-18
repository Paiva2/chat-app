import { Request, Response } from "express"
import { ErrorHandling } from "../@types/types"
import UserModel from "../model/User.model"
import FetchUserService from "../services/fetchUserService"

export default class FetchUserController {
  static async handle(req: Request, res: Response) {
    const { userId } = req.params

    const userModel = new UserModel()

    const getUserProfileService = new FetchUserService(userModel)

    try {
      const userProfile = await getUserProfileService.exec({
        userId,
      })

      return res.status(200).send(userProfile)
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
