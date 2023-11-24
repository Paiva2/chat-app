import { TypeOrm } from "../../data-source"
import { Connection } from "../@types/types"
import { ConnectionsEntity } from "../database/entities/Connections.entity"
import { ConnectionsInterface } from "../interfaces/connectionsInterface"

export default class ConnectionsModel implements ConnectionsInterface {
  private connectionsEntity = new ConnectionsEntity()
  private connectionsRepository = TypeOrm.getRepository(ConnectionsEntity)

  async create(connections: string[]): Promise<Connection> {
    this.connectionsEntity.connectionOne = connections[0]
    this.connectionsEntity.connectionTwo = connections[1]

    this.connectionsRepository.save(this.connectionsEntity)

    return this.connectionsEntity
  }

  async findConnections(connections: string[]): Promise<Connection | null> {
    const [firstId, secondId] = connections

    const [findSimilarConnection] = await this.connectionsRepository.find({
      where: [
        { connectionOne: firstId },
        { connectionTwo: secondId },

        { connectionOne: secondId },
        { connectionTwo: firstId },
      ],
    })

    return findSimilarConnection
  }
}
