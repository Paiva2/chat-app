import { randomUUID } from "crypto"
import { Connection } from "../@types/types"
import { ConnectionsInterface } from "../interfaces/connectionsInterface"

export default class InMemoryConnections implements ConnectionsInterface {
  private connections: Connection[] = []

  async create(
    userToCreateConnection: string[],
    connectionOne: string,
    connectionTwo: string,
    connectionId: string | null
  ): Promise<Connection[]> {
    let newConnections = [] as Connection[]

    userToCreateConnection.forEach((userId) => {
      const newConnection: Connection = {
        id: connectionId ? connectionId : randomUUID(),
        connectionOne: connectionOne,
        connectionTwo: connectionTwo,
        createdAt: new Date(),
        updatedAt: new Date(),
        fkUser: userId,
      }

      newConnections.push(newConnection)
    })

    this.connections = this.connections.concat(newConnections)

    return newConnections
  }

  async findConnections(connections: string[]): Promise<Connection[]> {
    const findConnectionWithThoseTwoIds = this.connections.filter(
      (conn) =>
        connections.includes(conn.connectionOne) &&
        connections.includes(conn.connectionTwo)
    )

    return findConnectionWithThoseTwoIds
  }

  async findUserConnections(userId: string): Promise<Connection[]> {
    const userConnections = this.connections.filter(
      (conn) => conn.connectionOne === userId || conn.connectionTwo === userId
    )

    return userConnections
  }

  async findConnectionById(connectionId: string): Promise<Connection | null> {
    const connection = this.connections.find(
      (connection) => connection.id === connectionId
    )

    if (!connection) return null

    return connection
  }

  async delete(userId: string, connectionId: string): Promise<Connection> {
    const connection = this.connections.find(
      (connection) => connection.id === connectionId && connection.fkUser === userId
    )!

    const getConnectionIndex = this.connections.indexOf(connection)

    this.connections.splice(getConnectionIndex, 1)

    return connection
  }
}
