import { Connection } from "../../@types/types"
import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import UserInterface from "../../interfaces/userInterface"

interface DeleteConnectionServiceRequest {
  userId: string
  connectionId: string
}

type DeleteConnectionServiceResponse = Connection
export default class DeleteConnectionService {
  constructor(
    private userInterface: UserInterface,
    private connectionInterface: ConnectionsInterface
  ) {}

  async exec({
    connectionId,
    userId,
  }: DeleteConnectionServiceRequest): Promise<DeleteConnectionServiceResponse> {
    if (!userId || !connectionId) {
      throw {
        status: 403,
        error:
          "Invalid informations. You must provide an user id and connection id.",
      }
    }

    const getUser = await this.userInterface.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const findConnection = await this.connectionInterface.findConnectionById(
      connectionId
    )

    if (!findConnection) {
      throw {
        status: 404,
        error: "Connection not found.",
      }
    }

    const removedConnection = await this.connectionInterface.delete(
      userId,
      findConnection.id
    )

    return removedConnection
  }
}
