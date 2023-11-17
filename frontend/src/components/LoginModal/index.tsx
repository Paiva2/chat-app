import { ChevronLeft } from "lucide-react"
import { FormEvent, useContext, useState } from "react"
import { UserContextProvider } from "../../context/userContext"
import { AxiosError } from "axios"
import Cookies from "js-cookie"
import api from "../../lib/api"
import s from "./styles.module.css"
import AuthModal from "../AuthModal"

const formInitialState = {
  email: {
    value: "",
    error: false,
  },
  password: {
    value: "",
    error: false,
  },
}

const LoginModal = () => {
  const { openLoginModal, setOpenLoginModal, setOpenRegisterModal } =
    useContext(UserContextProvider)

  const [formFields, setFormFields] = useState(formInitialState)
  const [loginLoading, setLoginLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])

  function closeModalTotally() {
    setOpenLoginModal(false)
    setLoginLoading(false)
    setFormFields(formInitialState)
    setApiErrors([])
  }

  function handleChangeInputValue(
    field: string,
    subField: string,
    value: string | boolean
  ) {
    setFormFields((oldValue) => {
      return {
        ...oldValue,
        [field]: {
          ...oldValue[field as keyof typeof oldValue],
          [subField]: value,
        },
      }
    })
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()

    const getFormFields = Object.keys(formFields)

    getFormFields.forEach((field) => {
      if (!formFields[field as keyof typeof formFields].value) {
        handleChangeInputValue(field, "error", true)
      } else {
        handleChangeInputValue(field, "error", false)
      }
    })

    const doesAnyFieldHasError = Object.values(formFields).some(
      ({ value }) => !value
    )

    if (doesAnyFieldHasError) return

    setApiErrors([])
    setLoginLoading(true)

    try {
      const loginResponse = await api.post("/login", {
        email: formFields.email.value,
        password: formFields.password.value,
      })

      if (loginResponse.status === 200) {
        setFormFields(formInitialState)

        Cookies.set("chatapp-token", loginResponse.data.token)

        window.location.reload()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error?.response?.data.message

        setApiErrors((oldValue) => [...oldValue, errorMessage])
      }
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <AuthModal
      closeModalByOverlay={closeModalTotally}
      openModal={openLoginModal}
      key="loginModal"
    >
      <div className={s.formTitle}>
        <h1>Login</h1>
        <p>Welcome! Sign In to see your messages and contact friends.</p>
      </div>

      <form onSubmit={handleLogin} className={s.loginForm}>
        <div className={s.formFields}>
          <label>
            <input
              onChange={({ target }) =>
                handleChangeInputValue("email", "value", target.value)
              }
              type="text"
              value={formFields.email.value}
              className={formFields.email.value ? s.active : ""}
            />
            <p className={s.floatingText}>E-mail</p>
            {formFields.email.error && (
              <p className={s.errorField}>Invalid e-mail.</p>
            )}
          </label>

          <label>
            <input
              onChange={({ target }) =>
                handleChangeInputValue("password", "value", target.value)
              }
              type="password"
              className={formFields.password.value ? s.active : ""}
              value={formFields.password.value}
            />
            <p className={s.floatingText}>Password</p>
            {formFields.password.error && (
              <p className={s.errorField}>Invalid password.</p>
            )}
          </label>
        </div>

        <button disabled={loginLoading} className={s.forgotPassButton} type="button">
          Forgot your password?
        </button>

        <button disabled={loginLoading} className={s.loginButton} type="submit">
          Login
        </button>

        <span className={s.registerNow}>
          Not registered yet?{" "}
          <button
            onClick={() => {
              closeModalTotally()
              setOpenRegisterModal(true)
            }}
            disabled={loginLoading}
            type="button"
          >
            Register now
          </button>
        </span>

        <span className={s.closeModalButton}>
          <button onClick={closeModalTotally} title="Back" type="button">
            <ChevronLeft color="#6263fb" />
          </button>
        </span>

        {!!apiErrors.length &&
          apiErrors.map((error, idx) => {
            return (
              <p key={idx} className={s.errorField}>
                {error}
              </p>
            )
          })}
      </form>
    </AuthModal>
  )
}

export default LoginModal
