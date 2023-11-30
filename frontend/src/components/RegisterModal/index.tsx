import { ChevronLeft } from "lucide-react"
import { FormEvent, useContext, useEffect, useState } from "react"
import { UserContextProvider } from "../../context/userContext"
import { AxiosError } from "axios"
import AuthModal from "../AuthModal"
import api from "../../lib/api"
import s from "./styles.module.css"

type FormErrors = {
  email: boolean
  password: boolean
  username: boolean
  passwordConfirmation: boolean
}

const formDefaultValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  username: "",
}

const RegisterModal = () => {
  const {
    openRegisterModal,
    setOpenLoginModal,
    setOpenRegisterModal,
    setOpenForgotPassModal,
  } = useContext(UserContextProvider)

  const [formFields, setFormFields] = useState(formDefaultValues)
  const [formErrors, setFormErrors] = useState<FormErrors>({} as FormErrors)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const [registerLoading, setRegisterLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [registerSucess, setRegisterSuccess] = useState(false)

  function closeModalTotally() {
    if (!formSubmitting) {
      setOpenRegisterModal(false)
      setRegisterLoading(false)
      setApiErrors([])
      setFormFields(formDefaultValues)
      setFormErrors({} as FormErrors)
    }
  }

  function handleUpdateInputValue(field: string, value: string) {
    setFormFields((oldValue) => {
      return {
        ...oldValue,
        [field]: value,
      }
    })
  }

  function getFormErrors() {
    const errors = {} as FormErrors

    const { password } = formFields

    const fields = Object.keys(formFields)

    for (const field of fields) {
      const formValue = formFields[field as keyof typeof formFields]

      if (
        !formValue ||
        (field === "passwordConfirmation" && formValue !== password)
      ) {
        errors[field as keyof typeof errors] = true
      }
    }

    return errors
  }

  async function handleSubmitRegister() {
    setRegisterLoading(true)

    try {
      const registerResponse = await api.post("/register", {
        email: formFields.email,
        password: formFields.password,
        passwordConfirmation: formFields.passwordConfirmation,
        username: formFields.username,
      })

      if (registerResponse.status === 201) {
        setFormFields(formDefaultValues)

        setRegisterSuccess(true)

        setFormErrors({} as FormErrors)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error?.response?.data.message

        setApiErrors((oldValue) => [...oldValue, errorMessage])
      }
    } finally {
      setInterval(() => setRegisterSuccess(false), 5000)

      setRegisterLoading(false)

      setFormSubmitting(false)
    }
  }

  const handleRegister = (e: FormEvent) => {
    e.preventDefault()

    setFormErrors(getFormErrors())

    setFormSubmitting(true)
  }

  useEffect(() => {
    const getErrors = Object.keys(formErrors)

    if (!getErrors.length && formSubmitting) {
      handleSubmitRegister()
    } else {
      setFormSubmitting(false)
    }
  }, [formErrors])

  return (
    <AuthModal
      closeModalByOverlay={closeModalTotally}
      openModal={openRegisterModal}
      key="registerModal"
    >
      <div className={s.formTitle}>
        <h1>Register</h1>
        <p>Welcome! Sign In to save private messages and much more!</p>
      </div>

      <form onSubmit={handleRegister} className={s.registerForm}>
        <div className={s.formFields}>
          <label>
            <input
              value={formFields.username}
              onChange={({ target }) =>
                handleUpdateInputValue("username", target.value)
              }
              type="text"
              className={formFields.username ? s.active : ""}
            />
            <p className={s.floatingText}>Username</p>
            {formErrors.username && (
              <p className={s.errorField}>Invalid username.</p>
            )}
          </label>

          <label>
            <input
              value={formFields.email}
              onChange={({ target }) =>
                handleUpdateInputValue("email", target.value)
              }
              type="email"
              className={formFields.email ? s.active : ""}
            />
            <p className={s.floatingText}>E-mail</p>
            {formErrors.email && <p className={s.errorField}>Invalid e-mail.</p>}
          </label>

          <label>
            <input
              value={formFields.password}
              onChange={({ target }) =>
                handleUpdateInputValue("password", target.value)
              }
              type="password"
              className={formFields.password ? s.active : ""}
            />
            <p className={s.floatingText}>Password</p>
            {formErrors.password && (
              <p className={s.errorField}>Invalid password.</p>
            )}
          </label>

          <label>
            <input
              value={formFields.passwordConfirmation}
              onChange={({ target }) =>
                handleUpdateInputValue("passwordConfirmation", target.value)
              }
              type="password"
              className={formFields.passwordConfirmation ? s.active : ""}
            />
            <p className={s.floatingText}>Confirm Password</p>
            {formErrors.passwordConfirmation && (
              <p className={s.errorField}>Invalid password confirmation.</p>
            )}
          </label>
        </div>

        <button
          onClick={() => {
            closeModalTotally()
            setOpenForgotPassModal(true)
          }}
          disabled={registerLoading}
          className={s.forgotPassButton}
          type="button"
        >
          Forgot your password?
        </button>

        <button
          disabled={registerLoading}
          className={s.registerButton}
          type="submit"
        >
          Register
        </button>

        <span className={s.registerNow}>
          Already registered?{" "}
          <button
            onClick={() => {
              closeModalTotally()
              setOpenLoginModal(true)
            }}
            disabled={registerLoading}
            type="button"
          >
            Sign In!
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

        {registerSucess && (
          <p className={s.registerSuccess}>Registered sucessfully!</p>
        )}
      </form>
    </AuthModal>
  )
}

export default RegisterModal
