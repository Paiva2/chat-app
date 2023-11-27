import { randomUUID } from "crypto"
import { User } from "../../../@types/types"
import InMemoryConnections from "../../../in-memory/inMemoryConnections"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import HandleConnectionService from "../../connections/handleConnectionService"
import DeleteConnectionService from "../../connections/deleteConnectionService"

let inMemoryConnections: InMemoryConnections
let inMemoryUser: InMemoryUser

let handleConnectionService: HandleConnectionService

let sut: DeleteConnectionService

let userCreated: User

describe("Delete connection service", () => {
  beforeEach(async () => {
    inMemoryConnections = new InMemoryConnections()
    inMemoryUser = new InMemoryUser()

    sut = new DeleteConnectionService(inMemoryUser, inMemoryConnections)

    userCreated = await inMemoryUser.create("John Doe", "johndoe@email.com", "12345")

    handleConnectionService = new HandleConnectionService(
      inMemoryConnections,
      inMemoryUser
    )
  })

  it("should be possible to delete an connection", async () => {
    const firstConnectionId = userCreated.id
    const secondConnectionId = randomUUID()

    const newConnection = await handleConnectionService.exec({
      connections: [firstConnectionId, secondConnectionId],
    })

    await sut.exec({
      userId: userCreated.id,
      connectionId: newConnection[0].id,
    })

    const checkIfConnectionExists = await inMemoryConnections.findConnectionById(
      newConnection[0].id
    )

    expect(checkIfConnectionExists).toBeFalsy()
  })

  it("should not be possible to delete an connection without an user id OR an connection id", async () => {
    await expect(() => {
      return sut.exec({
        userId: "",
        connectionId: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error:
          "Invalid informations. You must provide an user id and connection id.",
      })
    )
  })

  it("should not be possible to delete an connection if user doesn't exists.", async () => {
    await expect(() => {
      return sut.exec({
        userId: "inexistent userid",
        connectionId: randomUUID(),
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })

  it("should not be possible to delete an connection if connection doesn't exists.", async () => {
    await expect(() => {
      return sut.exec({
        userId: userCreated.id,
        connectionId: "inexistent connection id",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Connection not found.",
      })
    )
  })
})
