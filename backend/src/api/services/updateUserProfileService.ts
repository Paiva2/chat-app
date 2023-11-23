import { User } from "../@types/types"
import { hash } from "bcryptjs"
import UserInterface from "../interfaces/userInterface"

type UpdateUserProfileServiceRequest = {
  userId: string
  infosToUpdate: {
    username?: string
    profileImage?: string
    password?: string
    newPasswordConfirmation?: string
  }
}

type UpdateUserProfileServiceResponse = User

export default class UpdateUserProfileService {
  constructor(private userInterface: UserInterface) {}

  async exec({
    infosToUpdate,
    userId,
  }: UpdateUserProfileServiceRequest): Promise<UpdateUserProfileServiceResponse> {
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

    if (infosToUpdate.password) {
      if (infosToUpdate.newPasswordConfirmation !== infosToUpdate.password) {
        throw {
          status: 403,
          error: "Passwords don't match.",
        }
      }

      infosToUpdate.password = await hash(infosToUpdate.password, 6)
    }

    const updatedUser = await this.userInterface.dynamicUpdate(userId, infosToUpdate)

    return updatedUser
  }
}
