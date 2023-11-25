import { randomUUID } from "crypto"
import { User } from "../../../@types/types"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import InMemoryUserFriend from "../../../in-memory/inMemoryUserFriend"
import GetUserFriendListService from "../../userFriendList/getUserFriendListService"
import InsertToFriendListService from "../../userFriendList/insertToFriendListService"
import RegisterNewUserService from "../../user/registerNewUserService"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserService
let userCreated: User
let inMemoryUserFriend: InMemoryUserFriend
let insertToFriendListService: InsertToFriendListService

let sut: GetUserFriendListService

describe("Get User Friend List Service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryUserFriend = new InMemoryUserFriend()

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    insertToFriendListService = new InsertToFriendListService(
      inMemoryUser,
      inMemoryUserFriend
    )

    sut = new GetUserFriendListService(inMemoryUser, inMemoryUserFriend)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })

    await insertToFriendListService.exec({
      userId: userCreated.id,
      userToInsert: {
        id: randomUUID(),
        profilePicture: "any pic",
        username: "test friend",
      },
    })

    await insertToFriendListService.exec({
      userId: userCreated.id,
      userToInsert: {
        id: randomUUID(),
        profilePicture: "any pic 2",
        username: "test friend 2",
      },
    })
  })

  it("should be possible to get all user friends", async () => {
    const userFriends = await sut.exec({ userId: userCreated.id })

    expect(userFriends).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        username: "test friend",
        profileImage: "any pic",
        addedAt: expect.any(Date),
        fkUser: userCreated.id,
        auth: false,
      }),
      expect.objectContaining({
        id: expect.any(String),
        username: "test friend 2",
        profileImage: "any pic 2",
        addedAt: expect.any(Date),
        fkUser: userCreated.id,
        auth: false,
      }),
    ])
  })

  it("should not be possible to get all user friends without an user id", async () => {
    await expect(() => {
      return sut.exec({ userId: "" })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to get all user friends if user doesn't exists", async () => {
    await expect(() => {
      return sut.exec({ userId: "Inexistent user ID." })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
