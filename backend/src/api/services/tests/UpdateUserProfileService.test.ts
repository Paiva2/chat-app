import InMemoryUser from "../../in-memory/inMemoryUser"
import RegisterNewUserService from "../user/registerNewUserService"
import { compare } from "bcryptjs"
import UpdateUserProfileService from "../user/updateUserProfileService"
import { User } from "../../@types/types"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserService

let sut: UpdateUserProfileService

let userCreated: User

describe("Update user profile service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    sut = new UpdateUserProfileService(inMemoryUser)

    userCreated = await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to update an user profile informations dynamically", async () => {
    const updateUser = await sut.exec({
      userId: userCreated.id,
      infosToUpdate: {
        username: "John Doe Changed",
        password: "changepass",
        newPasswordConfirmation: "changepass",
        profileImage: "Change profile picture",
      },
    })

    const compareHashedPasswordWithProvidedOne = await compare(
      "changepass",
      updateUser.password
    )

    expect(compareHashedPasswordWithProvidedOne).toBeTruthy()
    expect(updateUser).toEqual(
      expect.objectContaining({
        id: updateUser.id,
        username: "John Doe Changed",
        password: expect.any(String),
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
        profileImage: "Change profile picture",
      })
    )

    const updateUserAgain = await sut.exec({
      userId: userCreated.id,
      infosToUpdate: {
        username: "Change username",
        profileImage: "Change profile picture",
      },
    })

    expect(updateUserAgain).toEqual(
      expect.objectContaining({
        id: updateUser.id,
        username: "Change username",
        password: expect.any(String),
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt,
        profileImage: "Change profile picture",
      })
    )
  })

  it("should not be possible to update an user profile informations dynamically without an user id", async () => {
    await expect(() => {
      return sut.exec({
        userId: "",
        infosToUpdate: {
          username: "John Doe Changed",
          password: "changepass",
          newPasswordConfirmation: "changepass",
          profileImage: "Change profile picture",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Invalid user id.",
      })
    )
  })

  it("should not be possible to update an user profile informations dynamically if passwords don't match.", async () => {
    await expect(() => {
      return sut.exec({
        userId: userCreated.id,
        infosToUpdate: {
          username: "John Doe Changed",
          password: "changepass",
          newPasswordConfirmation: "different pass",
          profileImage: "Change profile picture",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Passwords don't match.",
      })
    )
  })

  it("should not be possible to update an user profile informations dynamically if user doesn't exists.", async () => {
    await expect(() => {
      return sut.exec({
        userId: "inexistent user id",
        infosToUpdate: {
          username: "John Doe Changed",
          password: "changepass",
          newPasswordConfirmation: "changepass",
          profileImage: "Change profile picture",
        },
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
