export const formatToDollar = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};
