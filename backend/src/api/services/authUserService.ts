import { User } from "../@types/types"
import UserInterface from "../interfaces/userInterface"
import { compare } from "bcryptjs"

type AuthUserServiceRequest = {
  email: string
  password: string
}

type AuthUserServiceResponse = User

export default class AuthUserService {
  constructor(private userInterface: UserInterface) {}

  async exec({
    email,
    password,
  }: AuthUserServiceRequest): Promise<AuthUserServiceResponse> {
    if (!email || !password) {
      throw {
        status: 422,
        error: "E-mail and password should be provided.",
      }
    }

    const getUser = await this.userInterface.findByEmail(email)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const checkIfPasswordsMatch = await compare(password, getUser?.password)

    if (!checkIfPasswordsMatch) {
      throw {
        status: 401,
        error: "Wrong credentials.",
      }
    }

    return {
      ...getUser,
      password: "",
    }
  }
}
