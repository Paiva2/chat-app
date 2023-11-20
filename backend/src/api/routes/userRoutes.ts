import { Express } from "express"
import verifyJwt from "../middleware/verifyJwt"
import RegisterNewUserController from "../controllers/registerNewUserController"
import ChangeUserPasswordControler from "../controllers/changeUserPasswordController"
import AuthUserController from "../controllers/authUserController"
import GetUserProfileController from "../controllers/getUserProfileController"
import FetchUserController from "../controllers/fetchUserController"
import InsertToFriendListController from "../controllers/InsertToFriendListController"
import GetUserFriendListController from "../controllers/getUserFriendListController"
import RemoveFromFriendListController from "../controllers/removeFromFriendListController"

export default function userRoutes(app: Express) {
  app.post("/register", RegisterNewUserController.handle)

  app.patch("/update-password", ChangeUserPasswordControler.handle)

  app.post("/login", AuthUserController.handle)

  app.get("/user/:userId", FetchUserController.handle)

  // Auth Routes

  app.get("/profile", [verifyJwt], GetUserProfileController.handle)

  app.get("/profile/friend-list", [verifyJwt], GetUserFriendListController.handle)

  app.post("/friend", [verifyJwt], InsertToFriendListController.handle)

  app.delete("/friend", [verifyJwt], RemoveFromFriendListController.handle)
}
