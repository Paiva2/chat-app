import { XCircle } from "lucide-react"
import s from "./styles.module.css"

const MultipleConnectionError = () => {
  return (
    <div className={s.multipleConnectionOverlay}>
      <div className={s.multipleConnectionsModal}>
        <h1>MULTIPLE CONNECTION DETECTED</h1>

        <p>
          Close your other connection and refresh the page or proceed using the other
          page.
        </p>

        <XCircle size={50} color="#b22a31" />
      </div>
    </div>
  )
}

export default MultipleConnectionError
