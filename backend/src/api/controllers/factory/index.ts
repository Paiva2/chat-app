import UserModel from "../../model/User.model"
import ConnectionsModel from "../../model/Connections.model"
import MessageModel from "../../model/Message.model"
import UserFriendModel from "../../model/UserFriend.model"
import AuthUserService from "../../services/user/authUserService"
import ChangeUserPasswordService from "../../services/user/changeUserPasswordService"
import FetchUserService from "../../services/user/fetchUserService"
import GetUserFriendListService from "../../services/userFriendList/getUserFriendListService"
import GetUserProfileService from "../../services/user/getUserProfileService"
import InsertToFriendListService from "../../services/userFriendList/insertToFriendListService"
import RegisterNewUserService from "../../services/user/registerNewUserService"
import RemoveFromFriendListService from "../../services/userFriendList/removeFromFriendListService"
import UpdateUserProfileService from "../../services/user/updateUserProfileService"
import InsertNewPrivateMessageService from "../../services/messages/insertNewPrivateMessageService"
import HandleConnectionService from "../../services/connections/handleConnectionService"
import GetUserMessagesService from "../../services/messages/getUserMessagesService"

export default class Factory {
  public static exec() {
    const userModel = new UserModel()
    const userFriendModel = new UserFriendModel()
    const connectionsModel = new ConnectionsModel()
    const messageModel = new MessageModel()

    const getUserMessagesService = new GetUserMessagesService(
      userModel,
      connectionsModel,
      messageModel
    )

    const insertNewPrivateMessageService = new InsertNewPrivateMessageService(
      connectionsModel,
      messageModel
    )

    const handleConnectionService = new HandleConnectionService(
      connectionsModel,
      userModel
    )

    const updateUserProfileService = new UpdateUserProfileService(userModel)

    const authUserService = new AuthUserService(userModel)

    const changeUserPasswordService = new ChangeUserPasswordService(userModel)

    const fetchUserService = new FetchUserService(userModel)

    const getUserFriendListService = new GetUserFriendListService(
      userModel,
      userFriendModel
    )

    const getUserProfileService = new GetUserProfileService(userModel)

    const insertToFriendListService = new InsertToFriendListService(
      userModel,
      userFriendModel
    )

    const registerNewUserService = new RegisterNewUserService(userModel)

    const removeFromFriendListService = new RemoveFromFriendListService(
      userModel,
      userFriendModel
    )

    return {
      getUserMessagesService,
      insertNewPrivateMessageService,
      handleConnectionService,
      updateUserProfileService,
      authUserService,
      changeUserPasswordService,
      getUserProfileService,
      getUserFriendListService,
      fetchUserService,
      insertToFriendListService,
      registerNewUserService,
      removeFromFriendListService,
    }
  }
}
