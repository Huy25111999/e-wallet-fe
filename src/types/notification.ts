export interface INotification {
  account?: string | undefined;
  amount?: number | undefined;
  transactionDate?: string | undefined;
  amountAfter?: string | undefined;
  content?: string | undefined;
  type?: number | undefined;
  typeMsg?: string | undefined;
  title?: string | undefined;
  createAt?: string | undefined;
}

export interface IUpdateStatusNotification {
  ids: string[];
  status: number;
}
