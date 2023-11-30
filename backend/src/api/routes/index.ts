import { Express } from "express"
import { upload } from "../../app"
import verifyJwt from "../middleware/verifyJwt"
import AuthUserController from "../controllers/user/authUserController"
import HandleConnectionController from "../controllers/connections/handleConnectionController"
import InsertNewPrivateMessageController from "../controllers/messages/insertNewPrivateMessageController"
import ChangeUserPasswordControler from "../controllers/user/changeUserPasswordController"
import FetchUserController from "../controllers/user/fetchUserController"
import GetUserProfileController from "../controllers/user/getUserProfileController"
import RegisterNewUserController from "../controllers/user/registerNewUserController"
import UpdateUserProfileController from "../controllers/user/updateUserProfileController"
import InsertToFriendListController from "../controllers/userFriendList/InsertToFriendListController"
import GetUserFriendListController from "../controllers/userFriendList/getUserFriendListController"
import RemoveFromFriendListController from "../controllers/userFriendList/removeFromFriendListController"
import GetUserMessagesController from "../controllers/messages/getUserMessagesController"
import dtoValidator from "../middleware/dtoValidator"
import {
  authUserDto,
  changeUserPasswordDto,
  registerNewUserDto,
} from "../dto/userDto"
import { insertToFriendListDto, removeFromFriendListDto } from "../dto/friendListDto"
import { insertNewPrivateMessageDto } from "../dto/messagesDto"
import DeleteConnectionController from "../controllers/connections/deleteConnectionController"
import { deleteConnectionDto, handleConnectionDto } from "../dto/connectionsDto"

export default function routes(app: Express) {
  app.post(
    "/register",
    [dtoValidator(registerNewUserDto)],
    RegisterNewUserController.handle
  )

  app.patch(
    "/update-password",
    [dtoValidator(changeUserPasswordDto)],
    ChangeUserPasswordControler.handle
  )

  app.post("/login", [dtoValidator(authUserDto)], AuthUserController.handle)

  app.get("/user/:userId", FetchUserController.handle)

  // Auth Routes

  app.get("/profile", [verifyJwt], GetUserProfileController.handle)

  app.patch("/profile", [verifyJwt], UpdateUserProfileController.handle)

  app.get("/profile/friend-list", [verifyJwt], GetUserFriendListController.handle)

  app.post(
    "/upload-profile-pic",
    [verifyJwt, upload.single("files")],
    UpdateUserProfileController.handleUpload
  )

  app.post(
    "/private-message",
    [dtoValidator(insertNewPrivateMessageDto)],
    InsertNewPrivateMessageController.handle
  )

  app.post(
    "/connection",
    [dtoValidator(handleConnectionDto)],
    HandleConnectionController.handle
  )

  app.post(
    "/friend",
    [verifyJwt, dtoValidator(insertToFriendListDto)],
    InsertToFriendListController.handle
  )

  app.delete(
    "/friend",
    [verifyJwt, dtoValidator(removeFromFriendListDto)],
    RemoveFromFriendListController.handle
  )

  app.get("/private-messages", [verifyJwt], GetUserMessagesController.handle)

  app.delete(
    "/connection",
    [verifyJwt, dtoValidator(deleteConnectionDto)],
    DeleteConnectionController.handle
  )
}
