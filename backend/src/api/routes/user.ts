import { Request, Response, Express } from "express"

export default function userRoutes(app: Express) {
  app.get("/register", (req: Request, res: Response) => {
    return res.status(200).send("Hello World")
  })
}
