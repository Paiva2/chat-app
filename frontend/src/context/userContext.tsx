import React, { createContext, useState, Dispatch, SetStateAction } from "react"

interface UserContextProviderProps {
  children: React.ReactNode
}

interface UserContextInterface {
  openLoginModal: boolean
  setOpenLoginModal: Dispatch<SetStateAction<boolean>>
}

export const UserContextProvider = createContext<UserContextInterface>(
  {} as UserContextInterface
)

const UserContext = ({ children }: UserContextProviderProps) => {
  const [openLoginModal, setOpenLoginModal] = useState(false)

  return (
    <UserContextProvider.Provider
      value={{
        openLoginModal,
        setOpenLoginModal,
      }}
    >
      {children}
    </UserContextProvider.Provider>
  )
}

export default UserContext
