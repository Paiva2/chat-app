import { MessageSquareDashed } from "lucide-react"
import s from "./styles.module.css"

const EmptyListPlaceholder = () => {
  return (
    <div className={s.placeHolderWrapper}>
      <h1>No Messages to show...</h1>
      <MessageSquareDashed size={70} color="#0f084e" />
    </div>
  )
}

export default EmptyListPlaceholder
