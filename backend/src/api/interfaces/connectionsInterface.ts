import { Connection } from "../@types/types"

export interface ConnectionsInterface {
  create(
    userToCreateConnection: string[],
    connectionOne: string,
    connectionTwo: string
  ): Promise<Connection[]>

  findConnections(connections: string[]): Promise<Connection[]>

  findUserConnections(userId: string): Promise<Connection[]>
}
