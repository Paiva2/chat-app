import { randomUUID } from "crypto"
import { TypeOrm } from "../../data-source"
import { UserFriend } from "../@types/types"
import { UserFriendEntity } from "../database/entities/UserFriend.entity"
import { UserFriendInterface } from "../interfaces/userFriendInterface"

export default class UserFriendModel implements UserFriendInterface {
  private userFriend = new UserFriendEntity()
  private userFriendRepository = TypeOrm.getRepository(UserFriendEntity)

  async create(
    username: string,
    profileImage: string,
    fkUser: string,
    id?: string | undefined
  ): Promise<UserFriend> {
    this.userFriend.username = username
    this.userFriend.fkUser = fkUser
    this.userFriend.profileImage = profileImage
    this.userFriend.id = id ?? randomUUID()

    await this.userFriendRepository.save(this.userFriend)

    return this.userFriend
  }

  async findFriendListUser(
    friendId: string,
    fkUser: string
  ): Promise<UserFriend | null> {
    try {
      const getFriend = await this.userFriendRepository.findOne({
        where: {
          id: friendId,
          fkUser,
        },
      })

      if (!getFriend) return null

      return getFriend
    } catch {
      return null
    }
  }
}
