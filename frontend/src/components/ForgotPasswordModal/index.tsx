import { ChevronLeft } from "lucide-react"
import { FormEvent, useContext, useEffect, useState } from "react"
import { UserContextProvider } from "../../context/userContext"
import { AxiosError } from "axios"
import AuthModal from "../AuthModal"
import api from "../../lib/api"
import s from "./styles.module.css"

interface InputErrors {
  email: boolean
  password: boolean
  passwordConfirmation: boolean
}
const formDefaultValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
}

const ForgotPasswordModal = () => {
  const {
    setOpenLoginModal,
    setOpenRegisterModal,
    openForgotPassModal,
    setOpenForgotPassModal,
  } = useContext(UserContextProvider)

  const [updateLoading, setUpdateLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [passwordUpdateSuccess, setUpdatePasswordSuccess] = useState(false)

  const [formFields, setFormFields] = useState(formDefaultValues)
  const [inputErrors, setInputErrors] = useState<InputErrors>({} as InputErrors)
  const [formSubmitting, setFormSubmitting] = useState(false)

  function closeModalTotally() {
    if (!formSubmitting) {
      setOpenForgotPassModal(false)
      setUpdateLoading(false)
      setApiErrors([])
      setFormFields(formDefaultValues)
      setInputErrors({} as InputErrors)
    }
  }

  function getFieldErrors() {
    const errors = {} as InputErrors

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

  function handleChangeInputValues(field: string, value: string) {
    setFormFields((oldValue) => {
      return {
        ...oldValue,
        [field]: value,
      }
    })
  }

  async function handleUpdatePasswordSubmit() {
    setApiErrors([])
    setUpdateLoading(true)

    try {
      const updatePasswordResponse = await api.patch("/update-password", {
        email: formFields.email,
        newPassword: formFields.passwordConfirmation,
        confirmNewPassword: formFields.passwordConfirmation,
      })

      if (updatePasswordResponse.status === 204) {
        setFormFields(formDefaultValues)

        setUpdatePasswordSuccess(true)

        setInputErrors({} as InputErrors)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error?.response?.data.message

        setApiErrors((oldValue) => [...oldValue, errorMessage])
      }
    } finally {
      setInterval(() => setUpdatePasswordSuccess(false), 5000)

      setUpdateLoading(false)
      setFormSubmitting(false)
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    setInputErrors(getFieldErrors())

    setFormSubmitting(true)
  }

  useEffect(() => {
    const doesFormHasErrors = Object.keys(inputErrors)

    if (!doesFormHasErrors.length && formSubmitting) {
      handleUpdatePasswordSubmit()
    } else {
      setFormSubmitting(false)
    }
  }, [inputErrors])

  return (
    <AuthModal
      closeModalByOverlay={closeModalTotally}
      openModal={openForgotPassModal}
      key="updatePasswordModal"
    >
      <div className={s.formTitle}>
        <h1>Forgot Password</h1>
        <p>Forgot your password? You can recover it below!</p>
      </div>

      <form onSubmit={handleLogin} className={s.forgotPasswordForm}>
        <div className={s.formFields}>
          <label>
            <input
              onChange={({ target }) =>
                handleChangeInputValues("email", target.value)
              }
              value={formFields.email}
              type="email"
              className={formFields.email ? s.active : ""}
            />
            <p className={s.floatingText}>E-mail</p>
            {inputErrors.email && <p className={s.errorField}>Invalid e-mail.</p>}
          </label>

          <label>
            <input
              onChange={({ target }) =>
                handleChangeInputValues("password", target.value)
              }
              value={formFields.password}
              type="password"
              className={formFields.password ? s.active : ""}
            />
            <p className={s.floatingText}>Password</p>
            {inputErrors.password && (
              <p className={s.errorField}>Invalid password.</p>
            )}
          </label>

          <label>
            <input
              onChange={({ target }) =>
                handleChangeInputValues("passwordConfirmation", target.value)
              }
              value={formFields.passwordConfirmation}
              type="password"
              className={formFields.passwordConfirmation ? s.active : ""}
            />
            <p className={s.floatingText}>Confirm Password</p>
            {inputErrors.passwordConfirmation && (
              <p className={s.errorField}>Invalid password confirmation.</p>
            )}
          </label>
        </div>

        <span className={s.registerNow}>
          Not registered yet?{" "}
          <button
            onClick={() => {
              closeModalTotally()
              setOpenRegisterModal(true)
            }}
            disabled={updateLoading}
            type="button"
          >
            Register now
          </button>
        </span>

        <button
          disabled={updateLoading}
          className={s.updatePassButton}
          type="submit"
        >
          Recover
        </button>

        <span className={s.registerNow}>
          Already registered?{" "}
          <button
            onClick={() => {
              setOpenLoginModal(true)
              closeModalTotally()
            }}
            disabled={updateLoading}
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

        {passwordUpdateSuccess && (
          <p className={s.updateSuccess}>Password updated sucessfully!</p>
        )}
      </form>
    </AuthModal>
  )
}

export default ForgotPasswordModal
