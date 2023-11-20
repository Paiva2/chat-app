import { Request, Response } from "express"
import decodeJwt from "../utils/decodeJwt"
import UserModel from "../model/User.model"
import UserFriendModel from "../model/UserFriend.model"
import GetUserFriendListService from "../services/getUserFriendListService"
import { ErrorHandling } from "../@types/types"

export default class GetUserFriendListController {
  static async handle(req: Request, res: Response) {
    const authToken = decodeJwt(req.headers.authorization as string)

    const userModel = new UserModel()
    const userFriendModel = new UserFriendModel()

    const getUserFriendListService = new GetUserFriendListService(
      userModel,
      userFriendModel
    )

    try {
      const userFriends = await getUserFriendListService.exec({
        userId: authToken.data.id,
      })

      return res.status(200).send(userFriends)
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
