import { Request, Response } from "express"
import { cloudinaryInit } from "../../app"
import fs from "fs"

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
}
