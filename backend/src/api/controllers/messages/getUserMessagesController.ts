import { Request, Response } from "express"
import { ErrorHandling } from "../../@types/types"
import decodeJwt from "../../utils/decodeJwt"
import Factory from "../factory"

export default class GetUserMessagesController {
  public static async handle(req: Request, res: Response) {
    const authToken = decodeJwt(req.headers.authorization as string)

    const { getUserMessagesService } = Factory.exec()

    try {
      const userMessages = await getUserMessagesService.exec({
        userId: authToken.data.id,
      })

      return res.status(200).send(userMessages)
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
