import { MessageSquareDashed, UserX2 } from "lucide-react"
import s from "./styles.module.css"

interface EmptyListPlaceholderProps {
  text: string
  iconNumber: number
}

const EmptyListPlaceholder = ({ text, iconNumber }: EmptyListPlaceholderProps) => {
  const listIcons = [
    <MessageSquareDashed size={70} color="#0f084e" />,
    <UserX2 size={70} color="#0f084e" />,
  ]

  return (
    <div className={s.placeHolderWrapper}>
      <h1>{text}</h1>
      {listIcons[iconNumber]}
    </div>
  )
}

export default EmptyListPlaceholder
