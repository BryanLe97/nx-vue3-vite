import { FILTERS_EQUAL } from "@kraftheinz/common";

const decimalFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 2,
});

const noDecimalFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const currencyFormatterNoFraction = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default {
  methods: {
    generateLabel(option, listKey) {
      let label = "";
      listKey.forEach((element, index) => {
        if (option[element] && option[element] != -1 && option[element] != 0) {
          label +=
            option[element] + (index !== listKey.length - 1 ? " - " : "");
        }
      });
      return label;
    },

    async fetchSelectedList(id, apiLink, isUseFullLink = false) {
      let url = isUseFullLink ? apiLink : `${apiLink}/${id}`;
      let res = await this.axios.get(url);
      if (res && res.data && res.data.results) {
        return [...res.data.results];
      }
      return [];
    },

    setFilter(resourceProps, key, value, operator = FILTERS_EQUAL) {
      resourceProps.crud.setFilter(key, {
        operator,
        value,
      });
    },

    setOption(resourceProps, key, value) {
      const { crud } = resourceProps;

      switch (key) {
        case "deleteFilter":
          value.forEach((filter) => {
            crud.deleteFilter(filter);
          });
          break;

        case "deletePagination":
          value && crud.deletePagination();
          break;
      }
    },

    fetchList(resourceProps, filters = {}, options = {}) {
      let url = null;

      Object.entries(filters).forEach(([key, value]) => {
        this.setFilter(resourceProps, key, value);
      });

      Object.entries(options).forEach(([key, value]) => {
        if (key === "url") url = value;
        else this.setOption(resourceProps, key, value);
      });

      resourceProps.crud.fetchList(url);
    },

    stringToCsvFile(fileName, data, isExcel = false, type = "") {
      let hiddenElement = document.createElement("a");
      if (isExcel) {
        let blob = new Blob([data], {
          type: type,
        });
        hiddenElement.href = URL.createObjectURL(blob);
      } else {
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(data);
      }
      hiddenElement.target = "_blank";
      hiddenElement.download = fileName;
      hiddenElement.click();
    },

    showErrorMsg(err) {
      this.$notification.error({
        message:
          this._.get(err, "response.data.message") || "Errors encountered",
      });
    },

    sortNationalAccount(a, b) {
      if (a.region != null && b.region != null) {
        var x = a.region.toLowerCase();
        var y = b.region.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return a.id - b.id;
      }
      return 0;
    },

    formatCurrency(value) {
      if (this._.isNil(value)) return "";
      return Math.abs(value) <= 100 ? currencyFormatter.format(value) : currencyFormatterNoFraction.format(value);
      // return currencyFormatterNoFraction.format(value);
    },

    formatDecimal(value) {
      if (this._.isNil(value)) return "";
      return value < 100
        ? decimalFormatter.format(value)
        : noDecimalFormatter.format(value);
    },

    convertValueToNumber(value){
      if (this._.isNil(value)) return "";
      if (value.includes("$")) {
        return +value.replace(/,|\$/g, "");
      } else if (value.includes("%")){
        return +value.replace(/,|%/g, "");
      }
      return +value.replace(",","");
    },

    percentage(partialValue, totalValue) {
      if (this._.isNil(partialValue) || this._.isNil(totalValue)) return "";
      let value = (partialValue - totalValue) * 100 / Math.abs(totalValue);
      value = +value.toFixed(1);

      return value.toFixed(1) != '-0.0' ? ( value >= 100 || value <= -100 ? value.toFixed() : value.toFixed(1)) + '%' : Math.abs(value).toFixed(1) + '%'
   },

   formatNumber(val, type, isBlank = false, interLength = 11, decimalLength = 2){
    const isNegative = val < 0  ? '- ' : ''; // Check if the value is negative
    const absoluteVal = Math.abs(val).toFixed(decimalLength); // Get the absolute value
    const [integerPart, decimalPart] = String(absoluteVal).split("."); // split the int and the dec
    const limitedIntegerPart = integerPart.slice(0, interLength); // limit integer part to inter length characters
    const formattedInteger = limitedIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add comma between the every three number
    const finalNumber = `${formattedInteger || "0"}${type && type != 'number' ?  '.' + decimalPart : ''}`
    switch (type) {
      case "currency":
        if (!val || (isBlank && val == 0)) return;
        return `${isNegative}$` + finalNumber; // join the int and the dec together
      case "percent":
        if (!val) return isBlank ? "" : null;
        return `${isNegative}` + finalNumber + '%'; // join the int and the dec together
      default:
        if (!val) return isBlank ? "" : null;
        return `${isNegative}` + finalNumber; // join the int and the dec together
    }
   },
  },
};
