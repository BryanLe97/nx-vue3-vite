import { localize, setLocale } from "@vee-validate/i18n"
import * as rules from '@vee-validate/rules';

import { configure, defineRule } from "vee-validate"



const getWeeksBetweenDates = (startDate, endDate) => {
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const timeDifference = Math.abs(endTime - startTime);

  const totalWeeks = Math.ceil(timeDifference / millisecondsPerWeek);

  return totalWeeks;
};

// Define the rules
Object.keys(rules).forEach((rule) => {
  if (rule === 'required') {
    defineRule(rule, (value) => {
      if (!value || !value.length) return `{field} is required`;
    });
    return;
  }
  defineRule(rule, rules[rule]);
});

// Configure the locales
configure({
  generateMessage: localize('en', context => {
    return `The field ${context.field} is invalid`;
  }),
});

defineRule("requiredOneOf", (value, targets, ctx) => {
  const hasValue = targets.some((target) => !!target)
  return hasValue
    ? true
    : t("common:messages.error.required_field", { field: ctx.field })
})

defineRule("email", (value) => {
  if (!value) return true

  if (Array.isArray(value)) {
    return value.every((val) => EMAIL_PATTERN.test(String(val)))
  }

  return EMAIL_PATTERN.test(String(value))
})

defineRule('decimal', (value) => {
  // Regular expression to validate a decimal number
  const regex = /^\d*\.?\d*$/;

  // If the value matches the regex, return true (valid)
  if (regex.test(value)) {
    return true;
  }

  // Otherwise, return an error message (invalid)
  return 'This field must be a decimal number';
});

defineRule("alpha_num_spaces", (value, params, ctx) => {
  if (!value) return true

  if (Array.isArray(value)) {
    return value.every(
      (val) =>
        ALPHA_NUMBER_SPACE_PATTERN.test(String(val)) ||
        t("common:messages.error.containCharacters", {
          item: ctx.field,
        })
    )
  }

  return (
    ALPHA_NUMBER_SPACE_PATTERN.test(String(value)) ||
    t("common:messages.error.containCharacters", {
      item: ctx.field,
    })
  )
})

defineRule("integer", (value, params, ctx) => {
  if (!value) return true

  return (
    Number.isInteger(+value) ||
    t("common:messages.error.integer", { item: ctx.field })
  )
})

defineRule("regexAndMessage", (value, params, ctx) => {
  if (!value) return true
  const regex = new RegExp(params[0])
  const message = params[1]
  return (
    regex.test(value.toString()) ||
    t("common:messages.error.fieldMessage", { field: ctx.field, message })
  )
})

defineRule("min_value", (value, params, ctx) => {
  if (!value && value !== 0) return true

  const min = params[0]

  return (
    value >= min ||
    t("common:messages.error.numberOrGreater", {
      item: ctx.field,
      count: min,
    })
  )
})

defineRule("phone_number", (value, params, ctx) => {
  const [maxLength] = params

  if (!value) return true

  if (maxLength && value?.toString().replace(/\s/g, "").length > maxLength) {
    return t("common:messages.error.digitsLess", {
      field: ctx.field,
      count: maxLength,
    })
  }

  return (
    PHONE_NUMBER_PATTERN.test(value.toString()) ||
    t("common:messages.error.validPhone", { field: ctx.field })
  )
})

defineRule("is_date_after", (value, params, ctx) => {
  return (
    isDateAfter(value , params ) ||
    t("common:messages.error.futureDate", { field: ctx.field })
  )
})

defineRule("less_than_something", (value, [min, nameSomething], ctx) => {
  if (!value && value !== 0) return true

  return (
    !!(+value <= +min) ||
    t("common:messages.error.less_compareNumber", {
      primaryItem: ctx.field,
      count: min,
      compareItem: nameSomething,
    })
  )
})

export { setLocale }
