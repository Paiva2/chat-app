import { UserFriend } from "../@types/types"
import { UserFriendInterface } from "../interfaces/userFriendInterface"
import UserInterface from "../interfaces/userInterface"

type InsertToFriendListServiceRequest = {
  userId: string
  userToInsert: {
    id: string
    username: string
    profilePicture: string
  }
}

type InsertToFriendListServiceResponse = UserFriend

export default class InsertToFriendListService {
  constructor(
    private userInterface: UserInterface,
    private userFriendInterface: UserFriendInterface
  ) {}

  async exec({
    userId,
    userToInsert,
  }: InsertToFriendListServiceRequest): Promise<InsertToFriendListServiceResponse> {
    if (!userId || !userToInsert) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    }

    if (!userToInsert.id) {
      throw {
        status: 403,
        error: "Invalid user to insert id.",
      }
    }

    const getUser = await this.userInterface.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const checkIfUserHasThisFriendAlready =
      await this.userFriendInterface.findFriendListUser(userToInsert.id, userId)

    if (checkIfUserHasThisFriendAlready) {
      throw {
        status: 409,
        error: "This user already has this friend on list.",
      }
    }

    const insertToFriendList = await this.userFriendInterface.create(
      userToInsert.username,
      userToInsert.profilePicture,
      userId,
      userToInsert.id
    )

    return insertToFriendList
  }
}
