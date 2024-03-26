export default {
  name: "CheckRequiredFields",
  methods: {
    checkRequiredFields(rules) {
      if (rules && rules.length) {
        let arrRules = rules.split("|");
        if (arrRules.includes("required")) return "asterisk-required";
      }
      return "";
    },
  },
};
