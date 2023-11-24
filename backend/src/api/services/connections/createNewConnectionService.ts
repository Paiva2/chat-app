import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import UserInterface from "../../interfaces/userInterface"

interface CreateNewConnectionServiceRequest {
  connections: string[]
}

export default class CreateNewConnectionService {
  constructor(
    private connectionsInterface: ConnectionsInterface,
    private userInteface: UserInterface
  ) {}

  async exec({ connections }: CreateNewConnectionServiceRequest) {
    const checkIfSomeConnectionIdAreRegistered =
      await this.userInteface.findByConnection(connections)

    if (!checkIfSomeConnectionIdAreRegistered?.length) {
      throw {
        status: 404,
        error: "None of the connection id's are registered.",
      }
    }

    const checkIfAlreadyHasAnConnectionWithThoseTwoIds =
      await this.connectionsInterface.findConnections(connections)

    if (checkIfAlreadyHasAnConnectionWithThoseTwoIds) {
      throw {
        status: 409,
        error: "An connection with those two id's already exists.",
      }
    }

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
