import Swal from "sweetalert2"
import { SweetAlertIcon } from "sweetalert2"

export const toast = (icon: SweetAlertIcon, alertText: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer)
      toast.addEventListener("mouseleave", Swal.resumeTimer)
    },
  })

  Toast.fire({
    icon: icon,
    title: alertText,
  })
}
