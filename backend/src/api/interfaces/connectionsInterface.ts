import { Connection } from "../@types/types"

export interface ConnectionsInterface {
  create(connections: string[]): Promise<Connection>

  findConnections(connections: string[]): Promise<Connection | null>

  findUserConnections(userId: string): Promise<Connection[]>
}
