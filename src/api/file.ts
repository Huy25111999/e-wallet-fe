import axios from "axios";
const CREATE_URL_GET_FILE = process.env.VUE_APP_URL + "/file/create-presigned-url-get-file";

const BaseUploadMediaToS3 = axios.create();
BaseUploadMediaToS3.interceptors.request.use((config: any) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Content-Type"] = "application/octet-stream; charset=binary";
  config.responseType = "blob";
  return config;
});

type IImageItem = {
  contentType: string;
  fieldname: string;
  filename: string;
  url: string;
};

export const getImageFromS3 = async (image: IImageItem) => {
  const res = await axios({
    method: "post",
    url: CREATE_URL_GET_FILE,
    data: {
      fileKeys: [image.filename],
    },
  });

  const { fileKey, urlUpload } = res.data[0];

  return BaseUploadMediaToS3.get(urlUpload, {
    responseType: "blob",
    headers: {
      "Content-Type": "application/octet-stream; charset=binary",
    },
  });
};
