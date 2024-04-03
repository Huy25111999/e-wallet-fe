import * as actions from "@/api/profile";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import { dataURLtoFile } from "@/helpers/fileHelper";
import { formatDateOfBirth, formatNumber } from "@/helpers/formatHelper";
import { usePhoto } from "@/helpers/usePhoto";
import { useToastify } from "@/helpers/useToastify";
import { IParamsUploadAvatar, ISessionKeyCreate } from "@/types";
import ProfilePhoneEditModal from "./profile-phone-edit-modal/ProfilePhoneEditModal.vue";
import { version } from "../../../package.json";

import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonPopover,
  IonRadio,
  IonRadioGroup,
  loadingController,
  modalController,
} from "@ionic/vue";
import {
  addCircleOutline,
  camera,
  cameraOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  imageOutline,
  logoUsd,
  logOutOutline,
  qrCode,
  scanCircle,
  trailSignOutline,
  createOutline,
} from "ionicons/icons";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { computed, defineComponent, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { showLoading } from "@/helpers/loadingHelper";
import { createSessionKeyToVerifyKYC } from "@/api/verification";
import { ILang } from "@/types";

export default defineComponent({
  name: "ProfilePage",
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonButton,
    ModalBreakpoint,
    IonRadioGroup,
    IonItem,
    IonRadio,
    IonLabel,
    IonPopover,
    ProfilePhoneEditModal,
  },
  setup() {
    const { t, locale } = useI18n({
      inheritLocale: true,
    });

    const { setLocaleMessage } = useI18n({ useScope: "global" });

    const langSelected = ref<ILang>({
      label: "En",
      value: "en",
      flag: "en.svg",
    });

    // const country1 = [
    //   {
    //     name: "Vietnamese",
    //     value: "vn",
    //     flag: "vn.svg",
    //   },
    //   {
    //     name: "Korean",
    //     value: "kr",
    //     flag: "kr.svg",
    //   },
    //   {
    //     name: "English",
    //     value: "en",
    //     flag: "en.svg",
    //   },
    // ];

    const country = ref();

    const fetchNationFn = () => {
      actions.getAllNation({}).then((res) => {
        if (res?.data) {
          const setlang = res.data.data.map((e: any) => {
            return {
              name: e.name,
              value: e.code,
              flag: e.code + ".svg",
            };
          });
          country.value = setlang;
        }
      });
    };

    const fetchLanguage = (langSelected: any) => {
      const params: any = {};
      actions.getAllNation(params).then((res) => {
        if (res?.data) {
          const filterCountry = res?.data?.data.find((e: any) => {
            return e.code === langSelected;
          });
          const getUrlCountry = filterCountry.fileJsonLanguage.url;
          fetch(getUrlCountry)
            .then((res) => res.json())
            .then((response) => {
              setLocaleMessage(langSelected.value, response);
            });
        }
      });
    };

    const STATUS_KYC = {
      isVerified: 1,
      unverify: -1,
      rejected: 0,
      verify_processing: 2,
    };
    const NODE_ENV = process.env.VUE_APP_NODE_ENV;

    const router = useRouter();
    const store = useStore();
    const toastify = useToastify();
    const { openCamera, photo } = usePhoto();

    const modal = ref();
    const isOpenWindowVerify = ref(false);
    const countrySelected = ref("en");
    const inputRef = ref<HTMLInputElement>();
    const isOpenPopover = ref<boolean>(false);
    const eventPopover = ref<Event>();
    const fileSelected = ref<any>("");

    const customerId = computed(() => store.getters.auth.customerId) as any;
    const userInfo = computed(() => store.getters.auth.userInfo) as any;

    const getFlag = (value: string) => {
      const selectedCountry = country.value?.find((e: any) => {
        return e.value == value;
      });
      if (selectedCountry) {
        return selectedCountry.flag;
      } else {
        return "en.svg";
      }
    };

    const hidePhoneNumber = (phone: string) => {
      if (phone) {
        return phone.slice(0, phone.length - 4).replace(/[0-9+]/g, "*") + phone.slice(-4);
      } else {
        return phone;
      }
    };

    const openPopover = (e: Event) => {
      isOpenPopover.value = true;
      eventPopover.value = e;
    };

    const handleLogout = () => {
      store.dispatch("auth/logout");
      store.dispatch("language/setLang", "en");
      locale.value = "en";
      store.dispatch("transaction/removeDischargeInfo");

      window.location.pathname = "/";
    };

    const navigate = (url: string) => {
      router.push({ path: url, replace: true });
    };

    const handleSelectCountry = (language) => {
      langSelected.value = language;
      localStorage.setItem("language", language);
      fetchLanguage(langSelected.value);
      store.dispatch("language/setLang", language);
      modalController.dismiss();
    };

    const onSelectFile = () => {
      inputRef.value?.click();
    };

    const updateAvatarUserFn = (params: any) => {
      showLoading();
      actions
        .updateAvatar(params)
        .then((res) => {
          toastify.showSuccess(t("profile.avatar.update_success"));
          isOpenPopover.value = false;
        })
        .catch((error) => {
          toastify.showError(error.response.data.message);
          isOpenPopover.value = false;
        })
        .finally(() => {
          loadingController.dismiss();
        });
    };

    const getAvatarFn = () => {
      if (userInfo.value.avatar) {
        const params = [userInfo.value.avatar.filename];
        actions.getImage(params).then((res) => {
          const base64Data = res.data[0].fileData;
          const currentUrl = `data:image/jpeg;base64,${base64Data}`;
          fileSelected.value = currentUrl;
        });
      }
    };

    const onFileChange = (event: any) => {
      const file = event.target.files[0];
      fileSelected.value = URL.createObjectURL(file);
      isOpenPopover.value = false;

      const params: IParamsUploadAvatar = {
        userId: userInfo.value.id,
        avatar: file,
      };
      updateAvatarUserFn(params);
    };

    watchEffect(() => {
      getAvatarFn();
      fetchNationFn();
    });

    const onOpenVerifyKyc = () => {
      router.push("profile/verification");
    };

    const fetchCustomerInfo = () => {
      actions.requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    onMounted(() => {
      window.addEventListener("message", (returnValue) => {
        if (isOpenWindowVerify.value) {
          fetchCustomerInfo();
        }
      });
    });

    return {
      router,
      userInfo,
      addCircleOutline,
      camera,
      qrCode,
      scanCircle,
      trailSignOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
      logoUsd,
      logOutOutline,
      modal,
      country,
      langSelected,
      getFlag,
      countrySelected,
      STATUS_KYC,
      modules: [Pagination],
      inputRef,
      isOpenPopover,
      eventPopover,
      cameraOutline,
      imageOutline,
      fileSelected,
      createOutline,
      onSelectFile,
      //getFlag,
      handleSelectCountry,
      formatDateOfBirth,
      handleLogout,
      t,
      formatNumber,
      hidePhoneNumber,
      navigate,
      openPopover,
      onFileChange,
      NODE_ENV,
      version,
      onOpenVerifyKyc,
    };
  },
});
