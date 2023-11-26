import { Connection } from "../../@types/types"
import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import UserInterface from "../../interfaces/userInterface"

interface HandleConnectionServiceRequest {
  connections: string[]
}

type HandleConnectionServiceRequestResponse = Connection[] | void

export default class HandleConnectionService {
  constructor(
    private connectionsInterface: ConnectionsInterface,
    private userInteface: UserInterface
  ) {}

  async exec({
    connections,
  }: HandleConnectionServiceRequest): Promise<HandleConnectionServiceRequestResponse> {
    const doesConnectionIdIsFromAnUser = await this.userInteface.findByConnection(
      connections
    )

    if (!doesConnectionIdIsFromAnUser?.length) {
      throw {
        status: 404,
        error: "None of the connection id's are registered.",
      }
    }

    const doesExistsAnConnectionWithThoseIds =
      await this.connectionsInterface.findConnections(connections)

    if (doesExistsAnConnectionWithThoseIds.length > 0) return

    if (connections.length < 2) {
      throw {
        status: 409,
        error: "You must provide two valid connections id's.",
      }
    }

    let userIdToCreateNewConnection = doesConnectionIdIsFromAnUser.map(
      ({ id }) => id
    )

    const newConnection = await this.connectionsInterface.create(
      userIdToCreateNewConnection,
      connections[0],
      connections[1]
    )

    return newConnection
  }
}
