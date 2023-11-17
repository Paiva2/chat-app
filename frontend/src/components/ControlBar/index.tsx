import { LogOut } from "lucide-react"
import { asideMenu } from "../../content/asideMenu"
import { useContext, useEffect, useState } from "react"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"
import Cookies from "js-cookie"
import { UserContextProvider } from "../../context/userContext"

const ControlBar = () => {
  const {
    activeMenu,
    whoIsReceivingPrivate,
    setPrivateMessages,
    setActiveMenu,
    setWhoIsReceivingPrivate,
    setOpenedProfiles,
  } = useContext(ChatContextProvider)

  const { openLoginModal, setOpenLoginModal } = useContext(UserContextProvider)

  const [userAuthToken, setUserAuthToken] = useState("")

  function handleClearProfilePopup() {
    setWhoIsReceivingPrivate({
      ...whoIsReceivingPrivate,
      to: {
        id: "",
        username: "",
      },
    })

    setOpenedProfiles("")
  }

  useEffect(() => {
    const getToken = Cookies.get("chatapp-token")

    if (getToken) {
      setUserAuthToken(getToken)
    }
  }, [])

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
        <li className={s.profileIcon}>
          <button className={s.openProfileTrigger}>
            <div className={s.icon} />
          </button>
        </li>
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
            <button type="button">
              <LogOut size={23} />
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default ControlBar
