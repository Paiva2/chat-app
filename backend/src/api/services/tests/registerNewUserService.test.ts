import InMemoryUser from "../../in-memory/inMemoryUser"
import RegisterNewUserService from "../user/registerNewUserService"
import { compare } from "bcryptjs"

let inMemoryUser: InMemoryUser
let sut: RegisterNewUserService

describe("Register new user service", () => {
  beforeEach(() => {
    inMemoryUser = new InMemoryUser()

    sut = new RegisterNewUserService(inMemoryUser)
  })

  it("should register a new user", async () => {
    const newUser = await sut.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })

    const compareHashedPasswordWithProvidedOne = await compare(
      "123456",
      newUser.password
    )

    expect(compareHashedPasswordWithProvidedOne).toBeTruthy()
    expect(newUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: "John Doe",
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it("should hash the new user password", async () => {
    const newUser = await sut.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })

    const compareHashedPasswordWithProvidedOne = await compare(
      "123456",
      newUser.password
    )

    expect(compareHashedPasswordWithProvidedOne).toBeTruthy()
    expect(newUser.password === "123456").toBeFalsy()
  })

  it("should not be possible to register a new user if passwords confirmation is wrong", async () => {
    await expect(() => {
      return sut.exec({
        email: "johndoe@email.com",
        username: "John Doe",
        password: "123456",
        passwordConfirmation: "diff password",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "Passwords doesn't match.",
      })
    )
  })

  it("should not be possible to register a new user if any request parameter are not provided.", async () => {
    await expect(() => {
      return sut.exec({
        email: "johndoe@email.com",
        username: "John Doe",
        password: "",
        passwordConfirmation: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error:
          "You must provide all user informations. Ex: email, username, password and password confirmation.",
      })
    )
  })

  it("should not be possible to register a new user if user email already is registered.", async () => {
    await sut.exec({
      email: "johndoe@email.com",
      username: "John Doe",
      password: "123456",
      passwordConfirmation: "123456",
    })

    await expect(() => {
      return sut.exec({
        email: "johndoe@email.com",
        username: "John Doe",
        password: "123456",
        passwordConfirmation: "123456",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        error: "This e-mail is already registered.",
      })
    )
  })
})
