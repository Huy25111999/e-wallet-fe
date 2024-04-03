import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonSlide,
  IonSlides,
  IonModal,
} from "@ionic/vue";
import { defineComponent, ref, watchEffect } from "vue";
import { getImageFromS3 } from "@/api/file";

export default defineComponent({
  name: "GuideSlideItem",
  props: ["guideImageItem"],
  components: {},

  setup(props, ctx) {
    const image = ref<string>("");

    watchEffect(() => {
      getImageFromS3(props.guideImageItem).then((res) => {
        image.value = URL.createObjectURL(res.data);
      });
    });

    const onGuideClick = () => {
      window.open(props.guideImageItem.url, "_blank");
    };

    return {
      image,
      onGuideClick,
      getImageFromS3,
    };
  },
});
