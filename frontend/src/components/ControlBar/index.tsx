import { useContext, useEffect, useState, ChangeEvent, FormEvent } from "react"
import { LogOut, User2, X } from "lucide-react"
import { asideMenu } from "../../content/asideMenu"
import { ChatContextProvider } from "../../context/chatContext"
import { UserContextProvider } from "../../context/userContext"
import Cookies from "js-cookie"
import s from "./styles.module.css"

interface ErrorInput {
  username: boolean
  password: boolean
  confirmPassword: boolean
}

const ControlBar = () => {
  const {
    activeMenu,
    whoIsReceivingPrivate,
    setPrivateMessages,
    setActiveMenu,
    setWhoIsReceivingPrivate,
    setOpenedProfiles,
  } = useContext(ChatContextProvider)

  const { openLoginModal, userProfile, setOpenLoginModal } =
    useContext(UserContextProvider)

  const [userAuthToken, setUserAuthToken] = useState("")
  const [validatingProfile, setValidatingProfile] = useState(true)
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [profileImage, setProfileImage] = useState<Blob | null>(null)

  const [formErrors, setFormErrors] = useState<ErrorInput>({} as ErrorInput)
  const [updateSubmitting, setUpdateSubmitting] = useState(false)
  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  function handleChangeInputValue(field: string, value: string) {
    setFormFields((oldValue) => {
      return {
        ...oldValue,
        [field]: value,
      }
    })
  }

  function handleClearProfilePopup() {
    setWhoIsReceivingPrivate({
      ...whoIsReceivingPrivate,
      to: {
        id: "",
        username: "",
        profilePicture: "",
      },
    })

    setOpenedProfiles("")
  }

  useEffect(() => {
    const getToken = Cookies.get("chatapp-token")

    if (getToken) {
      setUserAuthToken(getToken)
    }

    return () => {
      setValidatingProfile(false)
    }
  }, [userProfile])

  function handleLogout() {
    if (userAuthToken) {
      Cookies.remove("chatapp-token")

      window.location.reload()
    }
  }

  function handleChangeImageProfile(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement
    const files = target.files

    if (files) {
      setProfileImage(files[0])
    }
  }

  function handleFormErrors() {
    const errors = {} as ErrorInput

    if (!formFields.username) {
      errors.username = true
    }

    if (!formFields.password) {
      errors.username = true
    }

    if (
      !formFields.confirmPassword ||
      formFields.confirmPassword !== formFields.password
    ) {
      errors.confirmPassword = true
    }

    setFormErrors(errors)
  }

  function handleSendUpdateForm() {}

  function sendUpdate(e: FormEvent) {
    e.preventDefault()

    handleFormErrors()

    setUpdateSubmitting(true)
  }

  useEffect(() => {
    const getErrors = Object.keys(formErrors)

    if (!getErrors && updateSubmitting) {
      handleSendUpdateForm()
    }
  }, [formErrors])

  let displayimage = ""

  if (profileImage) {
    displayimage = URL.createObjectURL(profileImage as Blob)
  } else if (!profileImage && userProfile?.profileImage) {
    displayimage = userProfile?.profileImage
  } else {
    displayimage = "https://i.imgur.com/jOkraDo.png"
  }

  return (
    <div className={s.controlBarContainer}>
      <ul className={s.menuList}>
        {!userAuthToken && (
          <li className={s.loginButton}>
            <button onClick={() => setOpenLoginModal(!openLoginModal)} type="button">
              Login
            </button>
          </li>
        )}
        {userAuthToken && (
          <li className={s.profileIcon}>
            <button
              onClick={() => setOpenProfileModal(!openProfileModal)}
              className={s.openProfileTrigger}
            >
              {!validatingProfile ? (
                <img
                  src={
                    userProfile?.profileImage
                      ? userProfile?.profileImage
                      : "https://i.imgur.com/jOkraDo.png"
                  }
                  alt="Profile Picture"
                  className={s.icon}
                />
              ) : (
                <div className={s.loadingProfile} />
              )}
            </button>

            <div
              className={`${s.profileOverlay} ${
                openProfileModal ? s.activeModal : ""
              }`}
            >
              <div
                className={`${s.profileModal} ${
                  openProfileModal ? s.profileModalVisible : ""
                }`}
              >
                <div className={s.closeModal}>
                  <button
                    onClick={() => setOpenProfileModal(!openProfileModal)}
                    type="button"
                  >
                    {" "}
                    <X color="white" size={20} strokeWidth={3} />
                  </button>
                </div>

                <form onSubmit={sendUpdate} className={s.profileForm}>
                  <div className={s.profileFormWrapper}>
                    <div className={s.profilePic}>
                      <label
                        style={{
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "100% 100%",
                          backgroundImage: `url("${displayimage}")`,
                        }}
                        className={s.profilePicInput}
                      >
                        <div className={s.profilePicOverlay}>
                          <User2 strokeWidth={1} color="white" size={60} />
                        </div>
                        <input
                          onChange={handleChangeImageProfile}
                          type="file"
                          accept="image/*"
                        />
                      </label>
                    </div>

                    <label>
                      Username
                      <input
                        onChange={({ target }) =>
                          handleChangeInputValue("username", target.value)
                        }
                        type="text"
                        placeholder="Text here..."
                      />
                    </label>

                    <label>
                      Password
                      <input
                        onChange={({ target }) =>
                          handleChangeInputValue("password", target.value)
                        }
                        placeholder="Your new password..."
                        type="password"
                      />
                    </label>

                    <label>
                      Confirm password
                      <input
                        onChange={({ target }) =>
                          handleChangeInputValue("confirmPassword", target.value)
                        }
                        placeholder="Confirm your new password..."
                        type="password"
                      />
                    </label>
                  </div>

                  <button className={s.updateProfileButton} type="submit">
                    Update profile
                  </button>
                </form>
              </div>
            </div>
          </li>
        )}
        {asideMenu.map((item) => {
          return (
            <li
              key={item.id}
              className={`${activeMenu === item.name ? s.active : ""}`}
            >
              <button
                onClick={() => {
                  if (item.name === "Home") {
                    handleClearProfilePopup()
                    setPrivateMessages([])
                  }

                  if (item.name === "Friend List") {
                    handleClearProfilePopup()
                  }

                  setActiveMenu(item.name)
                }}
                type="button"
              >
                {item.icon}
              </button>
            </li>
          )
        })}
        {userAuthToken && (
          <li className={s.logoutButton}>
            <button onClick={handleLogout} type="button">
              <LogOut size={23} />
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default ControlBar
