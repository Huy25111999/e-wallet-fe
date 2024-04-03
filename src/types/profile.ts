export interface IParamsUploadAvatar {
  userId: string;
  avatar: File;
}

export interface IParamsUpdatePhone {
  userId: string;
  phone: string;
  countryCode: string;
}

export interface ILang {
  label: string;
  value: string;
  flag: string;
}
