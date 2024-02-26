<template>
  <div class="upload-details">
    <a-row type="flex" justify="space-between" align="middle">
      <h3 class="legend-title">Upload {{ title }}</h3>
      <a-badge v-if="hasStatus" class="status-badge">{{ text }}</a-badge>
    </a-row>

    <p v-if="createdBy" class="modified-by">
      {{ this.$moment(errorFiles.createdAt).format("DD/MM/YYYY hh:mm") }} by
      {{ createdBy.firstName }} {{ createdBy.lastName }}
    </p>

    <p v-if="hasDescription && !errorFiles.errors.length" class="error-message mt-3">
      There are some errors. Your files haven't been uploaded yet. Please check
      these problems below.
    </p>

    <ul class="error-files">
      <li class="error-files-item">
        <div class="file-name">
          <p>File: {{ errorFiles.fileName }}</p>

          <span v-if="failed">{{ `Failed: ${errorFiles.failed}` }}</span>
          <span v-else-if="!errorFiles.errors.length">
            <a-icon type="check-circle" theme="filled" />Succeeded
          </span>
        </div>

        <ul class="errors">
          <li v-for="(error, index) in errorFiles.errors" :key="index">{{ error }}</li>
        </ul>
      </li>
    </ul>

    <p v-if="hasStatus" class="upload-status">Upload files are processing...</p>
  </div>
</template>

<script>
export default {
  name: "UploadDetails",

  inject: ["apiUrl"],

  props: {
    errorFiles: {
      type: Object,
      default: () => ({}),
    },
    hasDescription: {
      type: Boolean,
      default: true,
    },
    hasStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      createdBy: {
        firstName: "",
        lastName: "",
      },
    };
  },

  computed: {
    text() {
      const { status } = this;
      return status.charAt(0).toUpperCase() + status.slice(1);
    },

    failed() {
      return this.errorFiles.failed && this.errorFiles.failed.split("/")[0] > 0;
    },
  },

  mounted() {
    this.fetchFullNameCreateBy(this.errorFiles.createdBy);
  },

  methods: {
    async fetchFullNameCreateBy(createdBy) {
      const { data } = await this.axios.get(
        `${import.meta.env.VITE_API_URL}/identities/ad/users/${createdBy}`
      );

      this.createdBy.firstName = data.firstName;
      this.createdBy.lastName = data.lastName;
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-details {
  .legend-title {
    font-size: 16px;
    color: #272d35;
    margin-bottom: 0;
  }

  .status-badge {
    padding: 4px 8px;

    font-size: 12px;
    color: #0062ff;

    background: #e5efff;
    border: 1px solid #99c0ff;
    border-radius: 2px;
  }

  .modified-by {
    font-size: 14px;
    color: #5c6c7f;
  }

  ul {
    padding-left: 0;
    list-style: none;
  }

  .error-files {
    margin-top: 16px;
    margin-bottom: 8px;

    .error-files-item {
      .file-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        p,
        span {
          font-size: 14px;
          color: #272d35;
        }

        p {
          font-weight: 500;
          margin-bottom: 0;
        }
      }

      .errors {
        max-height: 400px;
        overflow-y: auto;

        li {
          font-size: 14px;
          color: #f5222d;
        }
      }
    }
  }

  .upload-status {
    font-size: 14px;
    color: #475362;
  }

  .error-message {
    color: #f5222d;
    font-size: 14px;
    font-weight: 500;
  }

  .anticon-check-circle {
    margin-right: 4px;
    color: #15b982;
  }
}
</style>
