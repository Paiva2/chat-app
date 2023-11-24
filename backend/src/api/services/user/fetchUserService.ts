import { User } from "../../@types/types"
import UserInterface from "../../interfaces/userInterface"

type FetchUserServiceRequest = {
  userId: string
}

type FetchUserServiceResponse = Pick<
  User,
  "id" & "username" & "profileImage" & "email"
>

export default class FetchUserService {
  constructor(private userInterface: UserInterface) {}

  async exec({
    userId,
  }: FetchUserServiceRequest): Promise<FetchUserServiceResponse> {
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
      profileImage: getUser.profileImage,
      email: getUser.email,
    }

    return user
  }
}
