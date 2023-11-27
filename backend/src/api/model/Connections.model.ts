import { DeleteResult } from "typeorm"
import { TypeOrm } from "../../data-source"
import { Connection } from "../@types/types"
import { ConnectionsEntity } from "../database/entities/Connections.entity"
import { ConnectionsInterface } from "../interfaces/connectionsInterface"

export default class ConnectionsModel implements ConnectionsInterface {
  private connectionsEntity = new ConnectionsEntity()
  private connectionsRepository = TypeOrm.getRepository(ConnectionsEntity)

  async create(
    connections: string[],
    connectionOne: string,
    connectionTwo: string
  ): Promise<Connection[]> {
    let newConnectionsArr = [] as Connection[]

    connections.forEach(async (userId) => {
      await this.connectionsRepository
        .createQueryBuilder()
        .insert()
        .into(ConnectionsEntity)
        .values([
          {
            connectionOne,
            connectionTwo,
            fkUser: userId,
          },
        ])
        .execute()

      newConnectionsArr.push(this.connectionsEntity)
    })

    return newConnectionsArr
  }

  async findConnections(connections: string[]): Promise<Connection[]> {
    const [firstId, secondId] = connections

    const findSimilarConnection = await this.connectionsRepository.find({
      where: [
        { connectionOne: firstId, connectionTwo: secondId },
        { connectionOne: secondId, connectionTwo: firstId },
      ],
    })

    return findSimilarConnection
  }

  async findUserConnections(userId: string): Promise<Connection[]> {
    const getAllUserConnections = await this.connectionsRepository.find({
      where: {
        fkUser: userId,
      },
    })

    return getAllUserConnections
  }

  async delete(
    userId: string,
    connectionId: string
  ): Promise<Connection | DeleteResult> {
    const deleteConnection = await this.connectionsRepository.delete({
      id: connectionId,
      fkUser: userId,
    })

    return deleteConnection
  }

  async findConnectionById(connectionId: string): Promise<Connection | null> {
    const [findConnection] = await this.connectionsRepository.find({
      where: {
        id: connectionId,
      },
    })

    return findConnection
  }
}
