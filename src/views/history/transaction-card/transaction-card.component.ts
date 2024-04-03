import { defineComponent } from "vue";
import moment from "moment/moment";

export default defineComponent({
  name: "transaction-card",
  props: ["data"],
  setup() {
    function formatDateToDayMonthName(date: Date) {
      return moment(date).format("DD") + " " + moment(date).format("MMMM");
    }

    function formatDateToDayMonthYearName(date: number) {
      return moment.unix(date / 1000).format("LLL");
    }

    function formatNumber(number) {
      return new Intl.NumberFormat("en-IN").format(number);
    }
    function determineType(type: number) {
      switch (type) {
        case 1: {
          return "Top up";
        }
        case 2: {
          return "Transfer";
        }
        case 3: {
          return "Withdraw";
        }
        case 4: {
          return "Refund";
        }
      }
    }

    const getActionUpdateAmount = (type: string) => {
      switch (type) {
        case "plus": {
          return "+";
        }
        case "minus": {
          return "-";
        }
      }
    };

    function convertNumber(sign: string, numberStr: string) {
      if (sign) {
        return Number(sign + numberStr);
      }
      return Number(numberStr);
    }

    return {
      convertNumber,
      formatDateToDayMonthName,
      formatDateToDayMonthYearName,
      getActionUpdateAmount,
      formatNumber,
      determineType,
    };
  },
});
