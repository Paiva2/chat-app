import { LogOut } from "lucide-react"
import { asideMenu } from "../../content/asideMenu"
import { useContext } from "react"
import s from "./styles.module.css"
import { ChatContextProvider } from "../../context/chatContext"

const ControlBar = () => {
  const {
    activeMenu,
    setActiveMenu,
    setWhoIsReceivingPrivate,
    whoIsReceivingPrivate,
    setOpenedProfiles,
  } = useContext(ChatContextProvider)

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

  return (
    <div className={s.controlBarContainer}>
      <ul className={s.menuList}>
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
        <li className={s.logoutButton}>
          <button type="button">
            <LogOut size={23} />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ControlBar
