import { ChevronLeft } from "lucide-react"
import { useContext, useState } from "react"
import { UserContextProvider } from "../../context/userContext"
import s from "./styles.module.css"
import AuthModal from "../AuthModal"
import { useForm, SubmitHandler } from "react-hook-form"
import api from "../../lib/api"
import { AxiosError } from "axios"

type FormInputs = {
  email: string
  password: string
  username: string
  passwordConfirmation: string
}

const formDefaultValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  username: "",
}

const RegisterModal = () => {
  const { setOpenLoginModal, setOpenRegisterModal, openRegisterModal } =
    useContext(UserContextProvider)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: formDefaultValues,
  })

  const [loginLoading, setRegisterLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [registerSucess, setRegisterSuccess] = useState(false)

  function closeModalByOverlay() {
    setOpenRegisterModal(false)
    setRegisterLoading(false)
    setApiErrors([])
  }

  const handleLogin: SubmitHandler<FormInputs> = async (data) => {
    setApiErrors([])
    setRegisterLoading(true)

    try {
      const loginResponse = await api.post("/register", {
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        username: data.username,
      })

      if (loginResponse.status === 201) {
        reset(formDefaultValues)

        setRegisterSuccess(true)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error?.response?.data.message

        setApiErrors((oldValue) => [...oldValue, errorMessage])
      }
    } finally {
      setInterval(() => setRegisterSuccess(false), 5000)

      setRegisterLoading(false)
    }
  }

  return (
    <AuthModal
      closeModalByOverlay={closeModalByOverlay}
      openModal={openRegisterModal}
      key="registerModal"
    >
      <div className={s.formTitle}>
        <h1>Register</h1>
        <p>Welcome! Sign In to save private messages and much more!</p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className={s.loginForm}>
        <div className={s.formFields}>
          <label>
            <input
              {...register("username", { required: true })}
              type="text"
              className={watch("username") ? s.active : ""}
            />
            <p className={s.floatingText}>Username</p>
            {errors.username && <p className={s.errorField}>Invalid username.</p>}
          </label>

          <label>
            <input
              {...register("email", { required: true })}
              type="text"
              className={watch("email") ? s.active : ""}
            />
            <p className={s.floatingText}>E-mail</p>
            {errors.email && <p className={s.errorField}>Invalid e-mail.</p>}
          </label>

          <label>
            <input
              {...register("password", { required: true })}
              type="password"
              className={watch("password") ? s.active : ""}
            />
            <p className={s.floatingText}>Password</p>
            {errors.password && <p className={s.errorField}>Invalid password.</p>}
          </label>

          <label>
            <input
              {...register("passwordConfirmation", { required: true })}
              type="password"
              className={watch("passwordConfirmation") ? s.active : ""}
            />
            <p className={s.floatingText}>Confirm Password</p>
            {errors.passwordConfirmation && (
              <p className={s.errorField}>Invalid password confirmation.</p>
            )}
          </label>
        </div>

        <button disabled={loginLoading} className={s.forgotPassButton} type="button">
          Forgot your password?
        </button>

        <button disabled={loginLoading} className={s.registerButton} type="submit">
          Register
        </button>

        <span className={s.registerNow}>
          Already registered?{" "}
          <button
            onClick={() => {
              setOpenLoginModal(true)
              setOpenRegisterModal(false)
            }}
            disabled={loginLoading}
            type="button"
          >
            Sign In!
          </button>
        </span>

        <span className={s.closeModalButton}>
          <button
            onClick={() => setOpenRegisterModal(false)}
            title="Back"
            type="button"
          >
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
