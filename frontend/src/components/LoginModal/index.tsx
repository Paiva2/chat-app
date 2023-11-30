import { ChevronLeft } from "lucide-react"
import { FormEvent, useContext, useState, useEffect } from "react"
import { UserContextProvider } from "../../context/userContext"
import { AxiosError } from "axios"
import Cookies from "js-cookie"
import api from "../../lib/api"
import AuthModal from "../AuthModal"
import s from "./styles.module.css"

interface ErrorInput {
  email: boolean
  password: boolean
}

const formInitialState = {
  email: "",
  password: "",
}

const LoginModal = () => {
  const {
    openLoginModal,
    setOpenLoginModal,
    setOpenRegisterModal,
    setOpenForgotPassModal,
  } = useContext(UserContextProvider)

  const [formFields, setFormFields] = useState(formInitialState)
  const [formErrors, setFormErrors] = useState<ErrorInput>({} as ErrorInput)
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false)

  const [loginLoading, setLoginLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])

  function closeModalTotally() {
    if (!isLoginSubmitting) {
      setOpenLoginModal(false)
      setLoginLoading(false)
      setFormFields(formInitialState)
      setApiErrors([])
      setFormErrors({} as ErrorInput)
    }
  }

  function handleChangeInputValue(field: string, value: string | boolean) {
    setFormFields((oldValue) => {
      return {
        ...oldValue,
        [field]: value,
      }
    })
  }

  function toggleFormErrors() {
    const errors = {} as ErrorInput

    const getFormFields = Object.keys(formFields)

    for (const field of getFormFields) {
      const fieldValue = formFields[field as keyof typeof formFields]

      if (!fieldValue) {
        errors[field as keyof typeof errors] = true
      }
    }

    return errors
  }

  async function handleSubmitLogin() {
    setApiErrors([])
    setLoginLoading(true)

    try {
      const loginResponse = await api.post("/login", {
        email: formFields.email,
        password: formFields.password,
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
      setIsLoginSubmitting(false)
    }
  }

  function handleLogin(e: FormEvent) {
    e.preventDefault()

    setFormErrors(toggleFormErrors())

    setIsLoginSubmitting(true)
  }

  useEffect(() => {
    const doesFormHasErrors = Object.keys(formErrors)

    if (!doesFormHasErrors.length && isLoginSubmitting) {
      handleSubmitLogin()
    } else {
      setIsLoginSubmitting(false)
    }
  }, [formErrors])

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
                handleChangeInputValue("email", target.value)
              }
              type="text"
              value={formFields.email}
              className={formFields.email ? s.active : ""}
            />
            <p className={s.floatingText}>E-mail</p>
            {formErrors.email && <p className={s.errorField}>Invalid e-mail.</p>}
          </label>

          <label>
            <input
              onChange={({ target }) =>
                handleChangeInputValue("password", target.value)
              }
              type="password"
              className={formFields.password ? s.active : ""}
              value={formFields.password}
            />
            <p className={s.floatingText}>Password</p>
            {formErrors.password && (
              <p className={s.errorField}>Invalid password.</p>
            )}
          </label>
        </div>

        <button
          onClick={() => {
            closeModalTotally()
            setOpenForgotPassModal(true)
          }}
          disabled={loginLoading}
          className={s.forgotPassButton}
          type="button"
        >
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
