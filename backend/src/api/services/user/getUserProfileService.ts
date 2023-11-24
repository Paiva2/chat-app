import { User } from "../../@types/types"
import UserInterface from "../../interfaces/userInterface"

type GetUserProfileServiceRequest = {
  userId: string
}

type GetUserProfileServiceResponse = Omit<User, "password">

export default class GetUserProfileService {
  constructor(private userInterface: UserInterface) {}

  async exec({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
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

    const user = {
      id: getUser.id,
      username: getUser.username,
      email: getUser.email,
      profileImage: getUser.profileImage,
      createdAt: getUser.createdAt,
      updatedAt: getUser.updatedAt,
    }

    return user
  }
}
