import InMemoryUser from "../../../in-memory/inMemoryUser"
import ChangeUserPasswordService from "../../user/changeUserPasswordService"
import RegisterNewUserService from "../../user/registerNewUserService"
import { compare } from "bcryptjs"

let inMemoryUser: InMemoryUser
let registerNewUserService: RegisterNewUserService

let sut: ChangeUserPasswordService

describe("Change User Password Service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()

    sut = new ChangeUserPasswordService(inMemoryUser)

    registerNewUserService = new RegisterNewUserService(inMemoryUser)

    await registerNewUserService.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })
  })

  it("should be possible to change an user password", async () => {
    const userUpdated = await sut.exec({
      email: "johndoe@email.com",
      newPassword: "1234567",
      confirmNewPassword: "1234567",
    })

    const compareUpdatedPasswordHash = await compare("1234567", userUpdated.password)
    const compareOldPasswordHash = await compare("123456", userUpdated.password)

    expect(compareUpdatedPasswordHash).toBeTruthy()
    expect(compareOldPasswordHash).toBeFalsy()

    expect(userUpdated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "John Doe",
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it("should not be possible to change an user password if request parameters are not provided correctly.", async () => {
    await expect(() => {
      return sut.exec({
        email: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error:
          "You must provide all user informations. Ex: email, password and password confirmation.",
      })
    )
  })

  it("should not be possible to change an user password if passwords doesn't match.", async () => {
    await expect(() => {
      return sut.exec({
        email: "johndoe@email.com",
        newPassword: "1234567",
        confirmNewPassword: "diff pass",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Passwords doesn't match.",
      })
    )
  })

  it("should not be possible to change an user password if user doesn't exists.", async () => {
    await expect(() => {
      return sut.exec({
        email: "inexistentuser@email.com",
        newPassword: "1234567",
        confirmNewPassword: "1234567",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "User not found.",
      })
    )
  })
})
