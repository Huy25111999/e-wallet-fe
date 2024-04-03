export interface IAuth {
  auth: {
    token: string;
    customerId: string;
  };
}

export interface IUserInfo {
  fullname: string;
  account: string;
  birthday: string;
  amount: number;
  createAt: number;
  id: string;
  isVerifiedKyc: number;
  phone: string;
  status: number;
  bankingCard: any;
  customerId: string;
  countryCode?: string;
}
