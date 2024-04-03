import aws from "aws-sdk";
import { getLinkUpload } from "@/api/verification";
import axios, { AxiosRequestConfig } from "axios";
import Buffer from "buffer";

const BaseUploadMediaToS3 = axios.create();
BaseUploadMediaToS3.interceptors.request.use((config: any) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Content-Type"] = "application/octet-stream; charset=binary";
  return config;
});

export function convertFileToArrayBuffer(file: File) {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", (err) => reject(err));
    reader.readAsArrayBuffer(file);
  });
}
export async function saveFileToS3Buket(
  fileReqs: Array<any>,
  bucketName: string,
  keyFileName: string
): Promise<Array<File>> {
  const files: Array<File> = [];
  for (let i = 0; i < fileReqs.length; i++) {
    if (fileReqs[i] && fileReqs[i].file) {
      const filename =
        keyFileName + "_" + new Date().getTime().toString() + "_" + fileReqs[i]?.file?.name;
      const getLink = await getLinkUpload({
        fileKeys: [filename],
      });
      const arrayBuffer = await convertFileToArrayBuffer(fileReqs[i].file);
      const buffer = Buffer.Buffer.from(arrayBuffer);
      await BaseUploadMediaToS3.put(getLink.data[0].urlUpload, buffer);
      const file: any = {
        filename: filename,
        contentType: fileReqs[i]?.type,
        url: filename,
        fieldname: fileReqs[i]?.type,
      };
      files.push(file);
    }
  }
  return files;
}
