import moment from "moment";

export const formatNumber = (number) => {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "USD" }).format(number);
};
export const formatTime = (date) => {
  return moment(date).format("YYYY/MM/DD HH:mm A");
};

export const formatDateOfBirth = (ts: number) => {
  return moment.unix(ts / 1000).format("DD/MM/YYYY");
};

export const formatNumberEN_IN = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

export const getNameMY = (date, format) => {
  return moment(date).format(format);
};
export const formatDateToDayMonthYearName = (date: Date) => {
  return (
    moment(date).format("DD") +
    " " +
    moment(date).format("MMMM") +
    " " +
    moment(date).format("YYYY")
  );
};

export const formatDateToDayMonthYearNameShort = (date: Date) => {
  return (
    moment(date).format("DD") + " " + moment(date).format("MMM") + " " + moment(date).format("YYYY")
  );
};
export const formatTimeDDMM = (date) => {
  return moment(date).format("MM/DD");
};
export const hidePhoneNumber = (phone: string) => {
  if (phone) {
    return phone.slice(0, phone.length - 4).replace(/[0-9+]/g, "*") + phone.slice(-4);
  } else {
    return phone;
  }
};
