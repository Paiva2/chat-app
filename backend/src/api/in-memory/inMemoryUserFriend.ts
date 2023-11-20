import { randomUUID } from "crypto"
import { UserFriend } from "../@types/types"
import { UserFriendInterface } from "../interfaces/userFriendInterface"

export default class InMemoryUserFriend implements UserFriendInterface {
  private userFriends: UserFriend[] = []

  async create(
    username: string,
    profileImage: string,
    fkUser: string,
    auth: boolean,
    id?: string | undefined
  ): Promise<UserFriend> {
    const newFriend = {
      id: id ?? randomUUID(),
      username,
      profileImage,
      addedAt: new Date(),
      auth,
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

  async removeById(friendOwnerId: string, friendId: string): Promise<UserFriend[]> {
    const findFriend = this.userFriends.find(
      (friend) => friend.id === friendId && friend.fkUser === friendOwnerId
    )

    if (findFriend) {
      const getFriendIndex = this.userFriends.indexOf(findFriend)

      this.userFriends.splice(getFriendIndex, 1)
    }

    const getUserFriendsUpdated = this.userFriends.filter(
      (friend) => friend.fkUser === friendOwnerId
    )

    return getUserFriendsUpdated
  }
}
