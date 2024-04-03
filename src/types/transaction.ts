export interface IQrCodeData {
  fullName?: string;
  accountTo?: string;
  accountFrom?: string;
  amount?: string;
  //
  customerId?: string;
  content?: string;
  price?: string;
  name?: string;
}

export interface IGenerateQrCode {
  account?: string;
  amount?: string | number;
  content?: string;
}
