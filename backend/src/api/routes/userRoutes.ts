import { Express } from "express"
import RegisterNewUserController from "../controllers/registerNewUserController"

export default function userRoutes(app: Express) {
  app.post("/register", RegisterNewUserController.handle)
}
