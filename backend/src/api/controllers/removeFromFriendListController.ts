import { Request, Response } from "express"
import Factory from "./factory"
import { ErrorHandling } from "../@types/types"
import decodeJwt from "../utils/decodeJwt"

export default class RemoveFromFriendListController {
  static async handle(req: Request, res: Response) {
    const { friendId } = req.body

    const authToken = decodeJwt(req.headers.authorization as string)

    const { removeFromFriendListService } = Factory.exec()

    try {
      await removeFromFriendListService.exec({
        friendId,
        userId: authToken.data.id,
      })

      return res.status(204).send({ message: "Friend removed successfully." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
