<template>
  <div class="upload-list">
    <p class="title-upload">Download the {{ title.name }} upload template</p>

    <div class="template-file">
      <a-row :gutter="24" type="flex">
        <a-col :lg="12" :xl="18">
          <a-icon type="file-zip" theme="filled" />&nbsp;
          <a
            :href="`${apiUrl}/files/assets/${fileName}-Upload-Template.${title.templateType}`"
            download
          >{{ fileName }}-Upload-Template.{{ title.templateType }}</a>
        </a-col>

        <a-col :lg="24" :xl="6" style="text-align: right">
          <a-icon type="cloud-download" />
        </a-col>
      </a-row>
    </div>

    <div class="drag-template mt-5 mb-5">
      <a-upload-dragger
        name="file"
        :multiple="multiple"
        :accept="'.' + title.templateType"
        :show-upload-list="false"
        :before-upload="onBeforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>

        <p class="ant-upload-text">
          <span>Click here</span> or drag file to this area to upload
        </p>

        <p class="ant-upload-hint">
          Single upload file should not be more than 10MB. Support only .{{ title.templateType }}
          file.
        </p>
      </a-upload-dragger>
    </div>

    <div v-if="files.length" class="files-uploaded-container">
      <p class="title-upload">Upload files</p>

      <ul class="files">
        <li v-for="(file, index) in files" :key="index">
          <a-icon type="file-excel" />
          <a>{{ file.name }}</a>
          <a-icon v-if="!loading" type="close" @click="files.splice(index, 1)" />
        </li>
      </ul>
    </div>

    <portal to="upload-product-modal-footer">
      <a-button key="back" @click="onCancelClick">Cancel</a-button>

      <a-button
        key="submit"
        :disabled="!files.length"
        type="primary"
        :loading="loading"
        @click="onUploadClick"
      >
        Upload
        <template v-if="files.length">({{ files.length }})</template>
      </a-button>
    </portal>
  </div>
</template>

<script>
const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "UploadList",

  props: {
    title: {
      type: Object,
      default: null,
    },
    files: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    onBeforeUpload: {
      type: Function,
      default: () => {},
    },
    onCancelClick: {
      type: Function,
      default: () => {},
    },
    onUploadClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      apiUrl,
    };
  },
  computed: {
    fileName() {
      return this.title.name.replace(/[^A-Z0-9]+/gi, "-");
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-list {
  .anticon-file-zip,
  .anticon-cloud-download {
    color: #92a0b0;
    font-size: 20px;
  }

  .template-file {
    padding: 10px;
    border: 1px solid #eaedf0;
    box-sizing: border-box;
    border-radius: 2px;
  }

  .drag-template {
    .ant-upload-text {
      font-size: 14px;
      margin-bottom: 4px;

      span {
        color: #0062ff;
      }
    }

    .ant-upload-hint {
      font-size: 14px;
    }
  }

  .files-container {
    .ant-row-flex {
      margin-bottom: 4px;

      a {
        flex-grow: 1;
        margin-left: 10px;
      }
    }
  }

  .files-uploaded-container {
    .title-upload {
      color: #475362;
      margin-bottom: 8px;
    }

    .files {
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 4px;

        a {
          flex-grow: 1;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
