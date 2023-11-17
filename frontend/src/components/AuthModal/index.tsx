import s from "./styles.module.css"

interface AuthModalProps {
  children: React.ReactNode
  openModal: boolean
  closeModalByOverlay: () => void
}

const AuthModal = ({ children, openModal, closeModalByOverlay }: AuthModalProps) => {
  return (
    <div
      className={`${openModal ? s.activeLogin : ""} ${s.modalOverlay}`}
      onClick={closeModalByOverlay}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${openModal ? s.activeLogin : ""} ${s.overlayWrapper}`}
      >
        {children}
      </div>
    </div>
  )
}

export default AuthModal
