import { randomUUID } from "crypto"
import { Connection } from "../@types/types"
import { ConnectionsInterface } from "../interfaces/connectionsInterface"

export default class InMemoryConnections implements ConnectionsInterface {
  private connections: Connection[] = []

  async create(connections: string[]): Promise<Connection> {
    const newConnection: Connection = {
      id: randomUUID(),
      connectionOne: connections[0],
      connectionTwo: connections[1],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.connections.push(newConnection)

    return newConnection
  }

  async findConnections(connections: string[]): Promise<Connection | null> {
    const findConnectionWithThoseTwoIds = this.connections.find(
      (conn) =>
        connections.includes(conn.connectionOne) &&
        connections.includes(conn.connectionTwo)
    )

    if (!findConnectionWithThoseTwoIds) return null

    return findConnectionWithThoseTwoIds
  }
}
