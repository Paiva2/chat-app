import UserModel from "../../model/User.model"
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
