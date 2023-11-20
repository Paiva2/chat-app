import { Request, Response } from "express"
import { ErrorHandling } from "../@types/types"
import decodeJwt from "../utils/decodeJwt"
import Factory from "./factory"

export default class InsertToFriendListController {
  static async handle(req: Request, res: Response) {
    const authToken = decodeJwt(req.headers.authorization as string)
    const userToInsert = req.body

    const { insertToFriendListService } = Factory.exec()

    try {
      await insertToFriendListService.exec({
        userId: authToken.data.id,
        userToInsert,
      })

      return res.status(204).json({ message: "User added to friend list." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
