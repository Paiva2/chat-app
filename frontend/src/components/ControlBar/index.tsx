import { useContext, useEffect, useState } from "react"
import { LogOut } from "lucide-react"
import { asideMenu } from "../../content/asideMenu"
import { ChatContextProvider } from "../../context/chatContext"
import { UserContextProvider } from "../../context/userContext"
import ProfileModal from "../ProfileModal"
import Cookies from "js-cookie"
import s from "./styles.module.css"

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

            <ProfileModal
              openProfileModal={openProfileModal}
              setOpenProfileModal={setOpenProfileModal}
            />
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
