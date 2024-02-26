export default {
  methods: {
    getTheFirstDayOfWeek(datetime, formatDateTime = "") {
      if (formatDateTime)
        return this.$moment(datetime)
          .startOf("isoWeek")
          .format(formatDateTime);
      return this.$moment(datetime).startOf("isoWeek");
    },
    getTheLastDayOfWeek(datetime, formatDateTime = "") {
      if (formatDateTime)
        return this.$moment(datetime)
          .endOf("isoWeek")
          .format(formatDateTime);
      return this.$moment(datetime).endOf("isoWeek");
    },
  },
};
