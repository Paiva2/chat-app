import { NextFunction, Request, Response } from "express"
import { ZodError, AnyZodObject, ZodEffects } from "zod"

const dtoValidator = (schemaToValidate: ZodEffects<AnyZodObject> | AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schemaToValidate.parse(req.body)

      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(422).send({
          message: e.errors.map((error) => {
            return `${error.message}: ${error.path}`
          }),
        })
      }
    }
  }
}

export default dtoValidator
