import { randomUUID } from "crypto"
import { UserFriend } from "../@types/types"
import { UserFriendInterface } from "../interfaces/userFriendInterface"

export default class InMemoryUserFriend implements UserFriendInterface {
  private userFriends: UserFriend[] = []

  async create(
    username: string,
    profileImage: string,
    fkUser: string,
    id?: string | undefined
  ): Promise<UserFriend> {
    const newFriend = {
      id: id ?? randomUUID(),
      username,
      profileImage,
      addedAt: new Date(),
      fkUser,
    }

    this.userFriends.push(newFriend)

    return newFriend
  }

  async findFriendListUser(
    friendId: string,
    fkUser: string
  ): Promise<UserFriend | null> {
    const findUser = this.userFriends.find(
      (friend) => friend.id === friendId && friend.fkUser === fkUser
    )

    if (!findUser) return null

    return findUser
  }

  async findAllUserFriends(fkUser: string): Promise<UserFriend[]> {
    const findUserFriends = this.userFriends.filter(
      (friend) => friend.fkUser === fkUser
    )

    return findUserFriends
  }
}
