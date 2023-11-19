import { Request, Response } from "express"
import UserModel from "../model/User.model"
import InsertToFriendListService from "../services/insertToFriendListService"
import UserFriendModel from "../model/UserFriend.model"
import { ErrorHandling } from "../@types/types"
import decodeJwt from "../utils/decodeJwt"

export default class InsertToFriendListController {
  static async handle(req: Request, res: Response) {
    const authToken = decodeJwt(req.headers.authorization as string)
    const userToInsert = req.body

    const userModel = new UserModel()
    const userFriendModel = new UserFriendModel()

    const insertToFriendListService = new InsertToFriendListService(
      userModel,
      userFriendModel
    )

    try {
      await insertToFriendListService.exec({
        userId: authToken.data.id,
        userToInsert,
      })

      return res.status(204).send({ message: "User added to friend list." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
