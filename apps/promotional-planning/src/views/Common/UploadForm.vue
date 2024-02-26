<template>
  <div class="upload-product">
    <a-modal
      :title="!hasErrors ? 'Upload ' + title.name : 'Upload Details'"
      :visible="visible"
      :after-close="handleCancel"
      @cancel="handleCancel"
    >
      <upload-list
        v-if="!hasErrors"
        :multiple="multiple"
        :files="files"
        :loading="loading"
        :title="title"
        :on-before-upload="beforeUpload"
        :on-cancel-click="handleCancel"
        :on-upload-click="handleUpload"
      />

      <upload-details
        v-else
        :title="title.name"
        :error-files="errorFiles"
        status="processing"
        :on-cancel-click="handleCancel"
        :type="type"
      />

      <template #footer>
        <div>
          <portal-target name="upload-product-modal-footer" />
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { ExportTypes } from "@/constants";

import UploadDetails from "./UploadDetails.vue";
import UploadList from "./UploadList.vue";

const { CSV_MIME_TYPES, EXCEL_MIME_TYPES, UPLOAD_TYPE } = ExportTypes;

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "UploadForm",

  components: {
    UploadDetails,
    UploadList,
  },

  inject: ["crud"],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
  },

  provide() {
    return {
      apiUrl,
    };
  },

  data() {
    return {
      apiUrl,
      files: [],
      errorFiles: {},
      loading: false,
    };
  },

  computed: {
    hasErrors() {
      return this.errorFiles.errors && this.errorFiles.errors.length > 0;
    },

    title() {
      return UPLOAD_TYPE.find((e) => e.type == this.type);
    },
  },

  methods: {
    checkFileType(file, typeCheck) {
      let fileTypes = typeCheck == "csv" ? CSV_MIME_TYPES : EXCEL_MIME_TYPES;
      const extension = file.name.split(".").pop();
      const { type } = file;

      return fileTypes.includes(type) && extension == typeCheck;
    },

    handleUpload() {
      const formData = new FormData();

      this.files.forEach((file) => {
        formData.append("files", file);
      });

      this.loading = true;

      this.axios
        .post(apiUrl + this.title.url, formData)
        .then((res) => {
          this.loading = false;

          const { data } = res;

          if (data.errors && data.errors.length) {
            this.errorFiles = data;
            return;
          }

          this.crud.fetchList();
          this.handleCancel();
          this.$notification.success({ message: "Item(s) Uploaded" });
        })
        .catch((err) => {
          this.loading = false;

          this.$notification.error({
            message:
              this._.get(err, "response.data.message") ||
              "An error occurred while uploading. Please check your file or contact the administrator.",
          });
        });
    },

    beforeUpload(file) {
      if (!this.multiple || this.type == 2) {
        this.files = [];
      }

      if (this.checkFileType(file, this.title.templateType)) {
        this.files = [...this.files, file];
      } else {
        this.$notification.error({
          message: `${this.title.name} support only .${this.title.templateType} file format.`,
        });
      }

      return false;
    },

    handleCancel() {
      if (!this.loading) {
        this.$emit("update:visible", false);

        setTimeout(() => {
          this.files = [];
          this.errorFiles = [];
        }, 200);
      } else {
        this.$notification.warning({
          message: "Upload file is being processed!",
        });
      }
    },
  },
};
</script>
