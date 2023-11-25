import { User } from "../../../@types/types"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import GetUserProfileService from "../../user/getUserProfileService"
import RegisterNewUserService from "../../user/registerNewUserService"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserService
let userCreated: User

let sut: GetUserProfileService

describe("Get user profile service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    sut = new GetUserProfileService(inMemoryUser)

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
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
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
