import { User } from "../../../@types/types"
import { randomUUID } from "crypto"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import RegisterNewUserService from "../../user/registerNewUserService"
import InsertNewPrivateMessageService from "../../messages/insertNewPrivateMessageService"
import InMemoryConnections from "../../../in-memory/inMemoryConnections"
import InMemoryMessage from "../../../in-memory/inMemoryMessage"
import GetUserMessagesService from "../../messages/getUserMessagesService"

let inMemoryUser: InMemoryUser
let inMemoryConnections: InMemoryConnections
let inMemoryMessage: InMemoryMessage

let registerNewUserService: RegisterNewUserService
let userCreated: User

let insertNewPrivateMessageService: InsertNewPrivateMessageService

let sut: GetUserMessagesService

async function createNewPrivateMessage(
  sendToId: string,
  message: string,
  sendToUsername: string
) {
  await insertNewPrivateMessageService.exec({
    newMessage: {
      message,
      sendToId: sendToId,
      sendToUsername,
      time: new Date().toString(),
      type: "private-message",
      userId: userCreated.id,
      username: userCreated.username,
      userProfilePic: userCreated.profileImage,
    },
  })
}

describe("Get user messages service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryConnections = new InMemoryConnections()
    inMemoryMessage = new InMemoryMessage()

    sut = new GetUserMessagesService(
      inMemoryUser,
      inMemoryConnections,
      inMemoryMessage
    )

    insertNewPrivateMessageService = new InsertNewPrivateMessageService(
      inMemoryConnections,
      inMemoryMessage
    )

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to get user private messages", async () => {
    const fakeUserId = randomUUID()
    const secondFakeUserId = randomUUID()

    // First conversation
    const [firstConnection] = await inMemoryConnections.create(
      [userCreated.id, fakeUserId],
      userCreated.id,
      fakeUserId,
      null
    )

    await createNewPrivateMessage(
      fakeUserId,
      "Message to first fake user id",
      "Fake user one"
    )

    // Second conversation
    const [secondConnection] = await inMemoryConnections.create(
      [userCreated.id, secondFakeUserId],
      userCreated.id,
      secondFakeUserId,
      null
    )

    await createNewPrivateMessage(
      secondFakeUserId,
      "Message to second fake user id",
      "Fake user two"
    )

    const getConversations = await sut.exec({
      userId: userCreated.id,
    })

    expect(getConversations).toEqual([
      expect.objectContaining({
        connections: expect.arrayContaining([userCreated.id, fakeUserId]),
        data: [
          expect.objectContaining({
            messageId: expect.any(String),
            message: "Message to first fake user id",
            sendToId: fakeUserId,
            sendToUsername: "Fake user one",
            time: expect.any(Date),
            type: "private-message",
            userId: userCreated.id,
            userProfilePic: userCreated.profileImage,
            username: userCreated.username,
            createdAt: expect.any(Date),
            fkConnections: firstConnection.id,
          }),
        ],
      }),

      expect.objectContaining({
        connections: expect.arrayContaining([userCreated.id, secondFakeUserId]),
        data: [
          expect.objectContaining({
            messageId: expect.any(String),
            message: "Message to second fake user id",
            sendToId: secondFakeUserId,
            sendToUsername: "Fake user two",
            time: expect.any(Date),
            type: "private-message",
            userId: userCreated.id,
            userProfilePic: userCreated.profileImage,
            username: userCreated.username,
            createdAt: expect.any(Date),
            fkConnections: secondConnection.id,
          }),
        ],
      }),
    ])
  })

  it("should not be possible to get user messages without an user id", async () => {
    await expect(() => {
      return sut.exec({
        userId: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to get user messages if user doesn't exists", async () => {
    await expect(() => {
      return sut.exec({
        userId: "Inexistent user id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to get user messages if user has no connections created before", async () => {
    const createdUserWithoutConnections = await registerNewUserService.exec({
      email: "no_connections_user@email.com",
      username: "User_No_Connections",
      password: "123456",
      passwordConfirmation: "123456",
    })

    const getUserConnections = await sut.exec({
      userId: createdUserWithoutConnections.id,
    })

    expect(getUserConnections).toEqual([])
  })
})
