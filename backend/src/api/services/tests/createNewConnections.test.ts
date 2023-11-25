import { randomUUID } from "crypto"
import InMemoryConnections from "../../in-memory/inMemoryConnections"
import InMemoryUser from "../../in-memory/inMemoryUser"
import { User } from "../../@types/types"
import HandleConnectionService from "../connections/handleConnectionService"

let inMemoryConnections: InMemoryConnections
let inMemoryUser: InMemoryUser

let sut: HandleConnectionService

let userCreated: User

describe("Create new connections", () => {
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
    })

    expect(newConnection).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        connectionOne: firstConnectionId,
        connectionTwo: secondConnectionId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it("should not be possible to create a new connection if none user on connection is registered", async () => {
    const firstConnectionId = randomUUID()
    const secondConnectionId = randomUUID()

    await expect(() => {
      return sut.exec({
        connections: [firstConnectionId, secondConnectionId],
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
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "You must provide two valid connections id's.",
      })
    )
  })
})
