import { Connection } from "../../@types/types"
import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import UserInterface from "../../interfaces/userInterface"

interface HandleConnectionServiceRequest {
  connections: string[]
}

type HandleConnectionServiceRequestResponse = Connection

export default class HandleConnectionService {
  constructor(
    private connectionsInterface: ConnectionsInterface,
    private userInteface: UserInterface
  ) {}

  async exec({
    connections,
  }: HandleConnectionServiceRequest): Promise<HandleConnectionServiceRequestResponse> {
    const checkIfSomeConnectionIdAreRegistered =
      await this.userInteface.findByConnection(connections)

    if (!checkIfSomeConnectionIdAreRegistered?.length) {
      throw {
        status: 404,
        error: "None of the connection id's are registered.",
      }
    }

    const doesExistsAnConnectionWithThoseIds =
      await this.connectionsInterface.findConnections(connections)

    if (doesExistsAnConnectionWithThoseIds) return doesExistsAnConnectionWithThoseIds

    if (connections.length < 2) {
      throw {
        status: 409,
        error: "You must provide two valid connections id's.",
      }
    }

    const newConnection = await this.connectionsInterface.create(connections)

    return newConnection
  }
}
