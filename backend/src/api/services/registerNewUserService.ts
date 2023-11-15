import UserInterface from "../interfaces/userInterface"
import { hash } from "bcryptjs"

type RegisterNewUserServiceRequest = {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

export default class RegisterNewUserService {
  constructor(private userInterface: UserInterface) {}

  async exec({
    username,
    email,
    password,
    passwordConfirmation,
  }: RegisterNewUserServiceRequest) {
    if (!username || !email || !password || !passwordConfirmation) {
      throw {
        status: 422,
        error:
          "You must provide all user informations. Ex: email, username, password and password confirmation.",
      }
    }

    if (password !== passwordConfirmation) {
      throw {
        status: 409,
        error: "Passwords doesn't match.",
      }
    }

    const doesUserEmailAlreadyExists = await this.userInterface.findByEmail(email)

    if (doesUserEmailAlreadyExists) {
      throw {
        status: 409,
        error: "This e-mail is already registered.",
      }
    }

    const hashPassword = await hash(password, 6)

    const userCreation = await this.userInterface.create(
      username,
      email,
      hashPassword
    )

    return userCreation
  }
}
