import { ChevronLeft } from "lucide-react"
import s from "./styles.module.css"
import { useContext } from "react"
import { UserContextProvider } from "../../context/userContext"

const LoginModal = () => {
  const { openLoginModal, setOpenLoginModal } = useContext(UserContextProvider)

  return (
    <div
      className={`${openLoginModal ? s.activeLogin : ""} ${s.loginModalOverlay}`}
      onClick={() => setOpenLoginModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${openLoginModal ? s.activeLogin : ""} ${s.loginWrapper}`}
      >
        <div className={s.formTitle}>
          <h1>Login</h1>
          <p>Welcome! SignIn to see your messages and contact friends.</p>
        </div>

        <form className={s.loginForm}>
          <div className={s.formFields}>
            <label>
              Username
              <input type="Username" />
            </label>

            <label>
              Password
              <input type="Username" />
            </label>
          </div>

          <button className={s.forgotPassButton} type="button">
            Forgot your password?
          </button>

          <button className={s.loginButton} type="button">
            Login
          </button>

          <span className={s.registerNow}>
            Not registered yet? <button type="button">Register now</button>
          </span>

          <span className={s.closeModalButton}>
            <button
              onClick={() => setOpenLoginModal(!openLoginModal)}
              title="Back"
              type="button"
            >
              <ChevronLeft color="#6263fb" />
            </button>
          </span>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
