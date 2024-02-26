<template>
  <div
    class="text-field"
    :style="[computedEventType !== notUrgent ? {'color': `${colors[computedEventType]}`} : '']"
  >
    <span class="d-inline-block mr-2">{{ parsedContent }}</span>

    <!-- add an info icon with tooltip if the next audit date's overdue or upcoming -->
    <template v-if="computedEventType !== notUrgent">
      <a-tooltip placement="top">
        <template slot="title">
          <span v-if="computedEventType === isOverdue">{{ getDistance }} overdue</span>
          <span v-else-if="computedEventType === isUpcoming">due in {{ getDistance }}</span>
        </template>
        <a-icon type="info-circle"></a-icon>
      </a-tooltip>
    </template>
  </div>
</template>

<script>
import { AUDIT_EVENT_TYPE } from "@/constants/others";

export default {
  name: "DueDateField",

  props: {
    value: {
      type: [String, Object],
      default: "",
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    parse: {
      type: Function,
      default: (value) => value,
    },
    title: {
      type: String,
      default: null,
    },
    eventType: {
      type: [Number, Function],
      default: 0,
    },
  },

  data() {
    return {
      isUpcoming: AUDIT_EVENT_TYPE.UPCOMING,
      isOverdue: AUDIT_EVENT_TYPE.OVERDUE,
      notUrgent: AUDIT_EVENT_TYPE.NOT_URGENT,
      colors: {
        [AUDIT_EVENT_TYPE.OVERDUE]: "#F5222D",
        [AUDIT_EVENT_TYPE.UPCOMING]: "#FA8C16",
        [AUDIT_EVENT_TYPE.NOT_URGENT]: "",
      },
    };
  },

  computed: {
    getDistance() {
      const f = "YYYY-MM-DD";
      const today = this.$moment().format(f);
      const dueDate = this.$moment(this.value).format(f);
      const distance = Math.abs(
        this.$moment(dueDate).diff(this.$moment(today), "days")
      );

      if (distance <= 1) return distance + " day";
      return distance + " days";
    },

    computedEventType() {
      if (typeof this.eventType == "number") return this.eventType;
      return this.eventType(this.value);
    },

    parsedContent() {
      return this.parse(this.value, this.record);
    },
  },
};
</script>
