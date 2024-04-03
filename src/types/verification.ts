export interface IFile {
  fieldname: string;
  description: string;
  filename: string;
  contentType: string;
  url: string;
}

export interface IVerification {
  customerId?: string;
  passportNo?: string;
  documentNo?: string;
  gender: string;
  date_of_issue: any;
  date_of_expiry: any;
  first_name: string;
  last_name: string;
  date_of_birth: any;
  place_of_birth: string;
  nationality: string;
  files?: Array<IFile>;
  frontside?: File;
  backside?: File;
  passport?: File;
  record?: File;
}

export interface IVerificationFile {
  frontside?: File;
  backside?: File;
  passport?: File;
  record?: File;
}

export interface ISessionKeyCreate {
  partnerId?: string;
  partnerKey?: string;
  callUrl?: string;
  responseUrl?: string;
  expirationTime?: string;
  userId?: string;
}
