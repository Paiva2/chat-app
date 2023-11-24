import { User } from "../../@types/types"
import InMemoryUser from "../../in-memory/inMemoryUser"
import AuthUserService from "../user/authUserService"
import RegisterNewUserService from "../user/registerNewUserService"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserService
let userCreated: User

let sut: AuthUserService

describe("Auth User Service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    sut = new AuthUserService(inMemoryUser)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to auth an user", async () => {
    const userAuth = await sut.exec({
      email: "johndoe@email.com",
      password: "123456",
    })

    expect(userAuth).toEqual(
      expect.objectContaining({
        id: userCreated.id,
        username: "John Doe",
        password: "",
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
      })
    )
  })

  it("should not be possible to auth an user if user doesn't exists.", async () => {
    await expect(() => {
      return sut.exec({
        email: "inexistent@email.com",
        password: "123456",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to auth an user if passwords don't match.", async () => {
    await expect(() => {
      return sut.exec({
        email: "johndoe@email.com",
        password: "wrong pass",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Wrong credentials.",
      })
    )
  })

  it("should not be possible to auth an user if email or password are not provided on request.", async () => {
    await expect(() => {
      return sut.exec({
        email: "",
        password: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "E-mail and password should be provided.",
      })
    )
  })
})
