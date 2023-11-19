import { User } from "../@types/types"
import { hash } from "bcryptjs"
import UserInterface from "../interfaces/userInterface"

type ChangeUserPasswordServiceRequest = {
  email: string
  newPassword: string
  confirmNewPassword: string
}

type ChangeUserPasswordServiceResponse = User

export default class ChangeUserPasswordService {
  constructor(private userInterface: UserInterface) {}

  async exec({
    confirmNewPassword,
    email,
    newPassword,
  }: ChangeUserPasswordServiceRequest): Promise<ChangeUserPasswordServiceResponse> {
    if (!email || !confirmNewPassword || !newPassword) {
      throw {
        status: 403,
        error:
          "You must provide all user informations. Ex: email, password and password confirmation.",
      }
    }

    if (newPassword !== confirmNewPassword) {
      throw {
        status: 409,
        error: "Passwords doesn't match.",
      }
    }

    const getUser = await this.userInterface.findByEmail(email)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const hashNewPassword = await hash(newPassword, 6)

    const updatedUser = await this.userInterface.updatePassword(
      getUser.id,
      hashNewPassword
    )

    return updatedUser as User
  }
}
