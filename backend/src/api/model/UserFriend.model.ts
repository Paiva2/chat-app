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
    auth: boolean,
    id?: string | undefined
  ): Promise<UserFriend> {
    this.userFriend.username = username
    this.userFriend.fkUser = fkUser
    this.userFriend.auth = auth
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

  async findAllUserFriends(fkUser: string): Promise<UserFriend[]> {
    const getFriend = await this.userFriendRepository.find({
      where: {
        fkUser,
      },
      order: {
        addedAt: "desc",
      },
    })

    return getFriend
  }

  async removeById(friendOwnerId: string, friendId: string): Promise<UserFriend[]> {
    const getFriend = (await this.userFriendRepository.delete({
      id: friendId,
      fkUser: friendOwnerId,
    })) as unknown as UserFriend[] // Force type cuz delete operation does not return updated values

    return getFriend
  }
}
