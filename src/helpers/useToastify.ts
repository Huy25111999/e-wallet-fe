import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export function useToastify() {
  const showSuccess = (content: string) => {
    toast.success(content, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const showError = (content: string) => {
    toast.error(content, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const showInfo = (content: string) => {
    toast.info(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 10000,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
