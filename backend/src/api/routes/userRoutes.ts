import { Express } from "express"
import RegisterNewUserController from "../controllers/registerNewUserController"
import ChangeUserPasswordControler from "../controllers/changeUserPasswordController"
import AuthUserController from "../controllers/authUserController"
import GetUserProfileController from "../controllers/getUserProfileController"
import verifyJwt from "../middleware/verifyJwt"

export default function userRoutes(app: Express) {
  app.post("/register", RegisterNewUserController.handle)

  app.patch("/update-password", ChangeUserPasswordControler.handle)

  app.post("/login", AuthUserController.handle)

  app.get("/profile", [verifyJwt], GetUserProfileController.handle)
}
