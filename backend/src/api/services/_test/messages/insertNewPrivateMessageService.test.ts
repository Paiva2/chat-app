import { Connection, Message, User } from "../../../@types/types"
import { randomUUID } from "crypto"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import RegisterNewUserService from "../../user/registerNewUserService"
import InsertNewPrivateMessageService from "../../messages/insertNewPrivateMessageService"
import InMemoryConnections from "../../../in-memory/inMemoryConnections"
import InMemoryMessage from "../../../in-memory/inMemoryMessage"

let inMemoryUser: InMemoryUser
let inMemoryConnections: InMemoryConnections
let inMemoryMessage: InMemoryMessage

let registerNewUserService: RegisterNewUserService
let userCreated: User
let connectionBetweenUsers: Connection

let sut: InsertNewPrivateMessageService

describe("Insert new private message service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryConnections = new InMemoryConnections()
    inMemoryMessage = new InMemoryMessage()

    sut = new InsertNewPrivateMessageService(inMemoryConnections, inMemoryMessage)

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to save a new private message", async () => {
    const secondConnectionId = randomUUID()

    connectionBetweenUsers = await inMemoryConnections.create([
      userCreated.id,
      secondConnectionId,
    ])

    const storedMessage = await sut.exec({
      newMessage: {
        message: "Hey test message",
        sendToId: secondConnectionId,
        sendToUsername: "Random User",
        time: new Date(),
        type: "private-message",
        userId: userCreated.id,
        username: userCreated.username,
        userProfilePic: userCreated.profileImage,
      },
    })

    expect(storedMessage).toEqual(
      expect.objectContaining({
        messageId: expect.any(String),
        message: "Hey test message",
        sendToId: secondConnectionId,
        sendToUsername: "Random User",
        time: expect.any(Date),
        type: "private-message",
        userId: userCreated.id,
        userProfilePic: userCreated.profileImage,
        username: userCreated.username,
        createdAt: expect.any(Date),
        fkConnections: connectionBetweenUsers.id,
      })
    )
  })

  it("should not be possible to save a new private message if there's no connection between users created before", async () => {
    await expect(() => {
      return sut.exec({
        newMessage: {
          message: "Hey test message",
          sendToId: randomUUID(),
          sendToUsername: "Random User",
          time: new Date(),
          type: "private-message",
          userId: userCreated.id,
          username: userCreated.username,
          userProfilePic: userCreated.profileImage,
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Connection for private message not found.",
      })
    )
  })

  it("should not be possible to save a new private message if new message schema is invalid", async () => {
    await expect(() => {
      return sut.exec({
        newMessage: {} as Message,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid new private message format.",
      })
    )
  })
})
