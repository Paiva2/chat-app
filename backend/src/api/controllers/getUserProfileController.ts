import { Request, Response } from "express"
import { ErrorHandling } from "../@types/types"
import UserModel from "../model/User.model"
import GetUserProfileService from "../services/getUserProfileService"
import decodeJwt from "../utils/decodeJwt"

export default class GetUserProfileController {
  static async handle(req: Request, res: Response) {
    const authToken = decodeJwt(req.headers.authorization as string)

    const userModel = new UserModel()

    const getUserProfileService = new GetUserProfileService(userModel)

    try {
      const userProfile = await getUserProfileService.exec({
        userId: authToken.data.id,
      })

      return res.status(200).send(userProfile)
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
