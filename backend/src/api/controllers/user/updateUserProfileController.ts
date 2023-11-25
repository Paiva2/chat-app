import { Request, Response } from "express"
import { cloudinaryInit } from "../../../app"
import { ErrorHandling } from "../../@types/types"
import fs from "fs"
import Factory from "../factory"
import decodeJwt from "../../utils/decodeJwt"

export default class UpdateUserProfileController {
  public static async handleUpload(req: Request, res: Response) {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    }

    try {
      const uploadResult = await cloudinaryInit.uploader.upload(
        req?.file?.path as string,
        options
      )

      fs.unlink(req?.file?.path as string, (errorDeletingFile) => {
        if (errorDeletingFile) {
          throw new Error("Error while removing file from local.")
        }
      })

      return res.status(201).send({ url: uploadResult.url })
    } catch (error) {
      return res.status(500).send({ message: "Error while creating file URL..." })
    }
  }

  public static async handle(req: Request, res: Response) {
    const { infosToUpdate } = req.body

    const authToken = decodeJwt(req.headers.authorization as string)

    const { updateUserProfileService } = Factory.exec()

    try {
      await updateUserProfileService.exec({
        infosToUpdate,
        userId: authToken.data.id,
      })

      return res.status(204).send({ message: "Update success." })
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
