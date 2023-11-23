import UserModel from "../../model/User.model"
import UserFriendModel from "../../model/UserFriend.model"
import AuthUserService from "../../services/authUserService"
import ChangeUserPasswordService from "../../services/changeUserPasswordService"
import FetchUserService from "../../services/fetchUserService"
import GetUserFriendListService from "../../services/getUserFriendListService"
import GetUserProfileService from "../../services/getUserProfileService"
import InsertToFriendListService from "../../services/insertToFriendListService"
import RegisterNewUserService from "../../services/registerNewUserService"
import RemoveFromFriendListService from "../../services/removeFromFriendListService"
import UpdateUserProfileService from "../../services/updateUserProfileService"

export default class Factory {
  public static exec() {
    const userModel = new UserModel()
    const userFriendModel = new UserFriendModel()

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
