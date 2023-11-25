import { randomUUID } from "crypto"
import { User } from "../../../@types/types"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import InMemoryUserFriend from "../../../in-memory/inMemoryUserFriend"
import InsertToFriendListService from "../../userFriendList/insertToFriendListService"
import RegisterNewUserService from "../../user/registerNewUserService"
import RemoveFromFriendListService from "../../userFriendList/removeFromFriendListService"

let inMemoryUser: InMemoryUser
let inMemoryUserFriend: InMemoryUserFriend

let registerNewUserService: RegisterNewUserService
let insertToFriendListService: InsertToFriendListService

let userCreated: User

let sut: RemoveFromFriendListService

describe("Remove from friend list service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryUserFriend = new InMemoryUserFriend()

    sut = new RemoveFromFriendListService(inMemoryUser, inMemoryUserFriend)

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    insertToFriendListService = new InsertToFriendListService(
      inMemoryUser,
      inMemoryUserFriend
    )

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to remove an friend from user friend list", async () => {
    const firstFriend = await insertToFriendListService.exec({
      userId: userCreated.id,
      userToInsert: {
        id: randomUUID(),
        profilePicture: "",
        username: "Friend 1",
      },
    })

    const secondFriend = await insertToFriendListService.exec({
      userId: userCreated.id,
      userToInsert: {
        id: randomUUID(),
        profilePicture: "friend 2 profile pic",
        username: "Friend 2",
      },
    })

    const friendRemoval = await sut.exec({
      userId: userCreated.id,
      friendId: firstFriend.id,
    })

    expect(friendRemoval).toEqual([
      expect.objectContaining({
        id: secondFriend.id,
        username: secondFriend.username,
        profileImage: secondFriend.profileImage,
        addedAt: secondFriend.addedAt,
        fkUser: userCreated.id,
        auth: false,
      }),
    ])
  })

  it("should not be possible to remove an friend from user friend list if user id or friend id are not provided", async () => {
    await expect(() => {
      return sut.exec({
        userId: "",
        friendId: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide an user id and an friend id.",
      })
    )
  })

  it("should not be possible to remove an friend from user friend list if user doesn't exists", async () => {
    await expect(() => {
      return sut.exec({
        userId: "Inexistent user id",
        friendId: "Any friend id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
