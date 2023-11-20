import { UserFriend } from "../@types/types"
import { UserFriendInterface } from "../interfaces/userFriendInterface"
import UserInterface from "../interfaces/userInterface"

type RemoveFromFriendListServiceRequest = {
  userId: string
  friendId: string
}

type RemoveFromFriendListServiceResponse = UserFriend[]

export default class RemoveFromFriendListService {
  constructor(
    private userInterface: UserInterface,
    private userFriendInterface: UserFriendInterface
  ) {}

  async exec({
    friendId,
    userId,
  }: RemoveFromFriendListServiceRequest): Promise<RemoveFromFriendListServiceResponse> {
    if (!userId || !friendId) {
      throw {
        status: 403,
        error: "You must provide an user id and an friend id.",
      }
    }

    const getUser = await this.userInterface.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const friendRemoval = await this.userFriendInterface.removeById(userId, friendId)

    return friendRemoval
  }
}
