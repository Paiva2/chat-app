import { DeleteResult } from "typeorm"
import { Connection } from "../@types/types"

export interface ConnectionsInterface {
  create(
    userToCreateConnection: string[],
    connectionOne: string,
    connectionTwo: string
  ): Promise<Connection[]>

  findConnections(connections: string[]): Promise<Connection[]>

  findUserConnections(userId: string): Promise<Connection[]>

  findConnectionById(connectionId: string): Promise<Connection | null>

  delete(userId: string, connectionId: string): Promise<Connection | DeleteResult>
}
