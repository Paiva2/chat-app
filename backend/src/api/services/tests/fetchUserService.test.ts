import { User } from "../../@types/types"
import InMemoryUser from "../../in-memory/inMemoryUser"
import FetchUserService from "../fetchUserService"
import RegisterNewUserService from "../registerNewUserService"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserService
let userCreated: User

let sut: FetchUserService

describe("Fetch User Service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    sut = new FetchUserService(inMemoryUser)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to get an user profile", async () => {
    const userProfile = await sut.exec({ userId: userCreated.id })

    expect(userProfile).toEqual(
      expect.objectContaining({
        id: userCreated.id,
        username: "John Doe",
        email: "johndoe@email.com",
        profileImage: "",
      })
    )
  })

  it("should not be possible to get an user profile if user doesn't exists.", async () => {
    await expect(() => {
      return sut.exec({ userId: "inexistent" })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to get an user profile if user id are not provided.", async () => {
    await expect(() => {
      return sut.exec({ userId: "" })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })
})
