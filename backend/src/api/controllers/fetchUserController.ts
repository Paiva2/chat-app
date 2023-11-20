import { Request, Response } from "express"
import { ErrorHandling } from "../@types/types"
import Factory from "./factory"

export default class FetchUserController {
  static async handle(req: Request, res: Response) {
    const { userId } = req.params

    const { fetchUserService } = Factory.exec()

    try {
      const userProfile = await fetchUserService.exec({
        userId,
      })

      return res.status(200).send(userProfile)
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
