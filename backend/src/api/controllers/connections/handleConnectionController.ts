import { Request, Response } from "express"
import Factory from "../factory"
import { ErrorHandling } from "../../@types/types"

export default class HandleConnectionController {
  public static async handle(req: Request, res: Response) {
    const { connections, connectionId } = req.body

    const { handleConnectionService } = Factory.exec()

    try {
      await handleConnectionService.exec({
        connections,
        connectionId,
      })

      return res.status(201).send()
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
