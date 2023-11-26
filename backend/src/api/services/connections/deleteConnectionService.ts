import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import UserInterface from "../../interfaces/userInterface"

interface DeleteConnectionServiceRequest {
  userId: string
  connection: string[]
}

export default class DeleteConnectionService {
  constructor(
    private userInterface: UserInterface,
    private connectionInterface: ConnectionsInterface
  ) {}

  async exec({ connection, userId }: DeleteConnectionServiceRequest) {
    const getUser = ""
  }
}
