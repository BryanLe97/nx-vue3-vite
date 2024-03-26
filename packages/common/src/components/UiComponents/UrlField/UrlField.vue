<template>
  <div :class="['url-field', className]">
    <router-link v-if="clickable" :to="editUrl">
      {{ parsedContent }}
    </router-link>

    <span
      v-else
      :style="{ cursor: onClick ? 'pointer' : 'auto' }"
      @click="handleClick"
    >
      {{ parsedContent }}
    </span>
  </div>
</template>

<script>
export default {
  name: "UrlField",

  props: {
    align: {
      type: String,
      default: "left",
    },
    baseUrl: {
      type: [String, Function],
      required: true,
      default: "",
    },
    idPropName: {
      type: String,
      default: "id",
    },
    parse: {
      type: Function,
      default: (value) => value,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: [String, Number, Object, Array],
      default: "Empty content",
    },
    query: {
      type: [Object, Function],
      default: (record) => record,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    className: {
      type: [String, Object],
      default: "",
    },
    onClick: {
      type: Function,
      default: null,
    },
    dataIndex: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
  },

  computed: {
    editUrl() {
      let url;

      if (typeof this.baseUrl == "string") {
        url = `${this.baseUrl}/${this.record[this.idPropName]}`;
      } else {
        url = this.baseUrl(this.record);
      }

      if (typeof this.query == "object") {
        url += "?";
        Object.keys(this.query).forEach((param) => {
          url += `${param}=${this.query[param]}&`;
        });
      } else if (typeof this.query == "function") {
        url += "?";
        url += this.query(this.record);
      }

      return url;
    },

    parsedContent() {
      return this.parse(this.value, this.record);
    },
  },

  methods: {
    handleClick() {
      if (this.onClick) {
        this.onClick(this.value, this.record);
      }
    },
  },
};
</script>
