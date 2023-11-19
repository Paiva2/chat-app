import { Express } from "express"
import RegisterNewUserController from "../controllers/registerNewUserController"
import ChangeUserPasswordControler from "../controllers/changeUserPasswordController"
import AuthUserController from "../controllers/authUserController"
import GetUserProfileController from "../controllers/getUserProfileController"
import FetchUserController from "../controllers/fetchUserController"
import verifyJwt from "../middleware/verifyJwt"
import InsertToFriendListController from "../controllers/InsertToFriendListController"

export default function userRoutes(app: Express) {
  app.post("/register", RegisterNewUserController.handle)

  app.patch("/update-password", ChangeUserPasswordControler.handle)

  app.post("/login", AuthUserController.handle)

  app.get("/profile", [verifyJwt], GetUserProfileController.handle)

  app.get("/user/:userId", FetchUserController.handle)

  app.post("/friend", [verifyJwt], InsertToFriendListController.handle)
}
