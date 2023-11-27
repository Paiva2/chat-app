import { ErrorHandling } from "../../@types/types"
import { Request, Response } from "express"
import decodeJwt from "../../utils/decodeJwt"
import Factory from "../factory"

export default class DeleteConnectionServicesController {
  public static async handle(req: Request, res: Response) {
    const { connectionId } = req.body
    const authToken = decodeJwt(req.headers.authorization as string)

    const { deleteConnectionService } = Factory.exec()

    try {
      await deleteConnectionService.exec({
        connectionId: connectionId,
        userId: authToken.data.id,
      })

      return res.status(200).send()
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
