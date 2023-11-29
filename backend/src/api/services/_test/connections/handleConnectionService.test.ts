import { randomUUID } from "crypto"
import { User } from "../../../@types/types"
import InMemoryConnections from "../../../in-memory/inMemoryConnections"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import HandleConnectionService from "../../connections/handleConnectionService"

let inMemoryConnections: InMemoryConnections
let inMemoryUser: InMemoryUser

let sut: HandleConnectionService

let userCreated: User

describe("Handle connection service", () => {
  beforeEach(async () => {
    inMemoryConnections = new InMemoryConnections()
    inMemoryUser = new InMemoryUser()

    userCreated = await inMemoryUser.create("John Doe", "johndoe@email.com", "12345")

    sut = new HandleConnectionService(inMemoryConnections, inMemoryUser)
  })

  it("should be possible to create an new connection", async () => {
    const firstConnectionId = userCreated.id
    const secondConnectionId = randomUUID()

    const newConnection = await sut.exec({
      connections: [firstConnectionId, secondConnectionId],
      connectionId: null,
    })

    expect(newConnection).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        connectionOne: firstConnectionId,
        connectionTwo: secondConnectionId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    ])
  })

  it("should be possible to create an new connection between two auth users", async () => {
    const secondUserCreated = await inMemoryUser.create(
      "John Doe 2",
      "johndoe2@email.com",
      "12345"
    )

    const firstConnectionId = userCreated.id
    const secondConnectionId = secondUserCreated.id

    const newConnection = await sut.exec({
      connections: [firstConnectionId, secondConnectionId],
      connectionId: null,
    })

    expect(newConnection).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        connectionOne: firstConnectionId,
        connectionTwo: secondConnectionId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        fkUser: firstConnectionId,
      }),

      expect.objectContaining({
        id: expect.any(String),
        connectionOne: firstConnectionId,
        connectionTwo: secondConnectionId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        fkUser: secondConnectionId,
      }),
    ])
  })

  it("should not be possible to create a new connection if none user on connection is registered", async () => {
    const firstConnectionId = randomUUID()
    const secondConnectionId = randomUUID()

    await expect(() => {
      return sut.exec({
        connections: [firstConnectionId, secondConnectionId],
        connectionId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "None of the connection id's are registered.",
      })
    )
  })

  it("should not be possible to create a new connection if two id's are not provided.", async () => {
    const firstConnectionId = userCreated.id

    await expect(() => {
      return sut.exec({
        connections: [firstConnectionId],
        connectionId: null,
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide two valid connections id's.",
      })
    )
  })
})
