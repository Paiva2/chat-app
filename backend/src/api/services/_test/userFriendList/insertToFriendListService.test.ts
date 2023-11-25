import { randomUUID } from "crypto"
import { User } from "../../../@types/types"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import InMemoryUserFriend from "../../../in-memory/inMemoryUserFriend"
import InsertToFriendListService from "../../userFriendList/insertToFriendListService"
import RegisterNewUserService from "../../user/registerNewUserService"

let inMemoryUser: InMemoryUser
let inMemoryUserFriend: InMemoryUserFriend
let registerNewUserService: RegisterNewUserService
let userCreated: User

let sut: InsertToFriendListService

describe("Insert to friend list service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryUserFriend = new InMemoryUserFriend()

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    sut = new InsertToFriendListService(inMemoryUser, inMemoryUserFriend)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to insert a new user to friend list", async () => {
    const userInserted = await sut.exec({
      userId: userCreated.id,
      userToInsert: {
        id: randomUUID(),
        profilePicture: "",
        username: "test friend",
      },
    })

    expect(userInserted).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "test friend",
        profileImage: "",
        addedAt: expect.any(Date),
        fkUser: userCreated.id,
        auth: false,
      })
    )
  })

  it("should be possible to insert a new AUTH user to friend list", async () => {
    const authFriend = await registerNewUserService.exec({
      email: "friend@email.com",
      username: "friend auth",
      password: "123456",
      passwordConfirmation: "123456",
    })

    const userInserted = await sut.exec({
      userId: userCreated.id,
      userToInsert: {
        id: authFriend.id,
        profilePicture: authFriend.profileImage,
        username: authFriend.username,
      },
    })

    expect(userInserted).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: authFriend.username,
        profileImage: authFriend.profileImage,
        addedAt: expect.any(Date),
        fkUser: userCreated.id,
        auth: true,
      })
    )
  })

  it("should not be possible to insert a new user to friend list if user already has that friend", async () => {
    const mockNewFriend = {
      id: randomUUID(),
      profilePicture: "",
      username: "test friend",
    }

    await sut.exec({
      userId: userCreated.id,
      userToInsert: mockNewFriend,
    })

    await expect(() => {
      return sut.exec({
        userId: userCreated.id,
        userToInsert: mockNewFriend,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "This user already has this friend on list.",
      })
    )
  })

  it("should not be possible to insert a new user to friend list without an user id", async () => {
    await expect(() => {
      return sut.exec({
        userId: "",
        userToInsert: {
          id: randomUUID(),
          profilePicture: "",
          username: "test friend",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to insert a new user to friend list without an user to insert id", async () => {
    await expect(() => {
      return sut.exec({
        userId: userCreated.id,
        userToInsert: {
          id: "",
          profilePicture: "",
          username: "test friend",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user to insert id.",
      })
    )
  })

  it("should not be possible to insert a new user to friend list if user inserting doesn't exists on db.", async () => {
    await expect(() => {
      return sut.exec({
        userId: "inexistent user id",
        userToInsert: {
          id: randomUUID(),
          profilePicture: "",
          username: "test friend",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
