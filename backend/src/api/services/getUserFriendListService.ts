import { UserFriend } from "../@types/types"
import { UserFriendInterface } from "../interfaces/userFriendInterface"
import UserInterface from "../interfaces/userInterface"

type GetUserFriendListServiceRequest = {
  userId: string
}

type GetUserFriendListServiceResponse = UserFriend[]

export default class GetUserFriendListService {
  constructor(
    private userInterface: UserInterface,
    private userFriendInterface: UserFriendInterface
  ) {}

  async exec({
    userId,
  }: GetUserFriendListServiceRequest): Promise<GetUserFriendListServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    }

    const getUser = await this.userInterface.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const userFriendList = await this.userFriendInterface.findAllUserFriends(
      getUser.id
    )

    return userFriendList
  }
}
