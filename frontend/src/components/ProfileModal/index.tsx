import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
  useContext,
} from "react"
import { User2, X } from "lucide-react"
import { UserContextProvider } from "../../context/userContext"
import { useQueryClient } from "@tanstack/react-query"
import s from "./styles.module.css"
import api from "../../lib/api"
import ws from "../../lib/socket.config"

interface ProfileModalProps {
  openProfileModal: boolean
  setOpenProfileModal: Dispatch<SetStateAction<boolean>>
}

interface ErrorInput {
  username: boolean
  password: boolean
  newPasswordConfirmation: boolean
}

const ProfileModal = ({
  openProfileModal,
  setOpenProfileModal,
}: ProfileModalProps) => {
  const { userProfile } = useContext(UserContextProvider)

  const defaultValues = {
    username: userProfile?.username,
    email: userProfile?.email,
    profileImage: userProfile?.profileImage,
    password: "",
    newPasswordConfirmation: "",
  }

  const [profileImage, setProfileImage] = useState<Blob | null>(null)

  const [formErrors, setFormErrors] = useState<ErrorInput>({} as ErrorInput)
  const [updateSubmitting, setUpdateSubmitting] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [formFields, setFormFields] = useState(defaultValues)

  const queryClient = useQueryClient()

  useEffect(() => {
    setFormFields(defaultValues)
  }, [userProfile?.username, userProfile?.email])

  function handleReset() {
    if (!updateSubmitting) {
      setOpenProfileModal(false)
      setFormFields(defaultValues)
      setFormErrors({} as ErrorInput)
      setUpdateSubmitting(false)
    }
  }

  function handleChangeInputValue(field: string, value: string) {
    setFormFields((oldValue) => {
      return {
        ...oldValue,
        [field]: value,
      }
    })
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

    if (
      (formFields.password && !formFields.newPasswordConfirmation) ||
      formFields.newPasswordConfirmation !== formFields.password
    ) {
      errors.newPasswordConfirmation = true
    }

    setFormErrors(errors)
  }

  async function updateProfileWithFile(newUserData: typeof formFields) {
    const formData = new FormData()

    formData.append("files", profileImage!)

    const uploadUrl = await api.post("/upload-profile-pic", formData, {
      headers: {
        Authorization: `Bearer ${userProfile?.token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    // TODO: TOAST ON SUCCESS OR ERRORS

    if (uploadUrl.status === 201) {
      const updateProfile = await api.patch(
        "/profile",
        {
          infosToUpdate: {
            ...newUserData,
            profileImage: uploadUrl.data.url,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userProfile?.token}`,
          },
        }
      )

      if (updateProfile.status === 201) {
        console.log("Sucess")
      }
    }
  }

  async function updateProfileWithoutFile(newUserData: typeof formFields) {
    delete newUserData.profileImage

    const updateProfileNoPicture = await api.patch(
      "/profile",
      {
        infosToUpdate: newUserData,
      },
      {
        headers: {
          Authorization: `Bearer ${userProfile?.token}`,
        },
      }
    )

    if (updateProfileNoPicture.status === 204) {
      console.log("Sucess")
    }
  }

  async function handleSendUpdateForm() {
    const newUserData = formFields

    setUpdateLoading(true)

    if (newUserData.username === userProfile?.email) {
      delete newUserData.username
    }

    for (const field of Object.keys(newUserData)) {
      if (!formFields[field as keyof typeof formFields]) {
        delete newUserData[field as keyof typeof formFields]
      }
    }

    try {
      if (profileImage) {
        updateProfileWithFile(newUserData)
      } else {
        updateProfileWithoutFile(newUserData)
      }

      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] })
    } catch (e) {
      console.log(e)
    } finally {
      setUpdateSubmitting(false)

      setUpdateLoading(false)
    }
  }

  function sendUpdate(e: FormEvent) {
    e.preventDefault()

    handleFormErrors()

    setUpdateSubmitting(true)
  }

  useEffect(() => {
    const getErrors = Object.keys(formErrors)

    if (!getErrors.length && updateSubmitting) {
      handleSendUpdateForm()
    }
  }, [updateSubmitting])

  let displayimage = ""

  if (profileImage) {
    displayimage = URL.createObjectURL(profileImage as Blob)
  } else if (!profileImage && userProfile?.profileImage) {
    displayimage = userProfile?.profileImage
  } else {
    displayimage = "https://i.imgur.com/jOkraDo.png"
  }

  return (
    <div
      onClick={handleReset}
      className={`${s.profileOverlay} ${openProfileModal ? s.activeModal : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${s.profileModal} ${
          openProfileModal ? s.profileModalVisible : ""
        }`}
      >
        <div className={s.closeModal}>
          <button onClick={handleReset} type="button">
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

            <label className={formErrors.username ? s.errorLabel : ""}>
              Username
              <input
                value={formFields.username ?? ""}
                onChange={({ target }) =>
                  handleChangeInputValue("username", target.value)
                }
                type="text"
                placeholder="Text here..."
              />
            </label>

            <label>
              E-mail
              <input disabled type="text" placeholder={formFields.email} />
            </label>

            <label>
              Password
              <input
                value={formFields.password}
                onChange={({ target }) =>
                  handleChangeInputValue("password", target.value)
                }
                placeholder="Your new password..."
                type="password"
              />
            </label>

            <label
              className={formErrors.newPasswordConfirmation ? s.errorLabel : ""}
            >
              Confirm password
              <input
                value={formFields.newPasswordConfirmation}
                onChange={({ target }) =>
                  handleChangeInputValue("newPasswordConfirmation", target.value)
                }
                placeholder="Confirm your new password..."
                type="password"
              />
            </label>
          </div>

          <button
            disabled={
              (!formFields.password && !formFields.username) || updateLoading
            }
            className={s.updateProfileButton}
            type="submit"
          >
            Update profile
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
