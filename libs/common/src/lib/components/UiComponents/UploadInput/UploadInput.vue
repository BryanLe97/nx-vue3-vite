<template>
  <div class="upload-input">
    <validation-provider
      v-if="formItem"
      v-slot="slotProps"
      :name="label"
      tag="div"
      :rules="rules"
      :style="{ height: '100%' }"
    >
      <a-form-item
        v-if="uploadType === `singleFile`"
        :help="slotProps.errors[0]"
        :validate-status="resolveState(slotProps)"
      >
        <a-upload
          v-model="inputImageUrl"
          class="avatar-uploader d-flex align-items-center justify-content-center"
          name="file"
          list-type="picture-card"
          :show-upload-list="false"
          :action="action"
          :before-upload="beforeUpload"
          :disabled="disabled"
          @change="onChange($event, slotProps.validate)"
        >
          <slot>
            <div>
              <div
                v-if="imageUrl"
                class="upload-pic"
                :style="{ backgroundImage: 'url(' + imageUrl + ')' }"
              ></div>

              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </div>
          </slot>
        </a-upload>
      </a-form-item>

      <a-form-item
        v-if="uploadType === `multiFile`"
        :help="slotProps.errors[0]"
        :validate-status="resolveState(slotProps)"
      >
        <a-upload
          v-model="listFiles"
          :action="action"
          name="file"
          :before-upload="beforeUpload"
          :disabled="disabled"
          list-type="picture-card"
          :file-list="listFiles"
          class="list-file-uploader"
          :remove="onRemove"
          @preview="handlePreview"
          @change="onChange($event, slotProps.validate)"
        >
          <div v-if="maxListLength ? listFiles.length < maxListLength : true">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>

        <a-modal
          :visible="previewVisible"
          :footer="null"
          :width="700"
          :body-style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
          @cancel="handleCancel"
        >
          <inner-image-zoom :src="previewImage" :fullscreen-on-mobile="true" />
        </a-modal>
      </a-form-item>
    </validation-provider>

    <template v-else>
      <a-upload
        v-if="uploadType === `singleFile`"
        name="file"
        list-type="picture-card"
        :show-upload-list="false"
        :action="action"
        :before-upload="beforeUpload"
        :disabled="disabled"
        @change="onChange"
      >
        <slot>
          <div>
            <div
              v-if="imageUrl"
              class="upload-pic"
              :style="{ backgroundImage: 'url(' + imageUrl + ')' }"
            ></div>

            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </div>
        </slot>
      </a-upload>

      <template v-if="uploadType === `multiFile`">
        <a-upload
          :action="action"
          name="file"
          :before-upload="beforeUpload"
          :disabled="disabled"
          list-type="picture-card"
          :file-list="listFiles"
          class="list-file-uploader"
          :remove="onRemove"
          @preview="handlePreview"
          @change="onChange($event, slotProps.validate)"
        >
          <div v-if="maxListLength ? listFiles.length < maxListLength : true">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>

        <a-modal
          :visible="previewVisible"
          :footer="null"
          :width="700"
          :body-style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
          @cancel="handleCancel"
        >
          <inner-image-zoom :src="previewImage" :fullscreen-on-mobile="true" />
        </a-modal>
      </template>
    </template>
  </div>
</template>

<script>
const apiUrl = process.env.VUE_APP_API_URL;

import "vue-inner-image-zoom/lib/vue-inner-image-zoom.css";
import InnerImageZoom from "vue-inner-image-zoom";

export default {
  name: "UploadInput",

  components: {
    "inner-image-zoom": InnerImageZoom,
  },

  props: {
    action: {
      type: String,
      default: "",
    },
    confirmRemoveContent: {
      type: String,
      default: "Are you sure about that?",
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    inputImageUrl: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    rules: {
      type: [String, Object],
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    uploadType: {
      type: String,
      default: "singleFile",
    },
    fileList: {
      type: Array,
      default: null,
    },
    maxListLength: {
      type: Number,
      default: undefined,
    },
    maxFileSize: {
      type: Number,
      default: 2,
    },
  },

  data() {
    return {
      loading: false,
      apiUrl,
      imageUrl: this.inputImageUrl ? encodeURI(this.inputImageUrl) : null,
      previewVisible: false,
      previewImage: "",
      listFiles: this.fileList,
    };
  },

  watch: {
    fileList(newVal) {
      this.listFiles = newVal;
    },
  },

  created() {
    if (this.inputImageUrl) {
      this.$emit("change", {
        [this.type]: this.inputImageUrl.replace(this.apiUrl, ""),
      });
    }
  },

  methods: {
    getBase64(img, callback) {
      const reader = new FileReader();

      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },

    getBase64File(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }

      const isLt2M = file.size / 1024 ** 2 < this.maxFileSize;

      if (!isLt2M) {
        this.$message.error(`Image must smaller than ${this.maxFileSize}MB!`);
      }

      return isJpgOrPng && isLt2M;
    },

    handleCancel() {
      this.previewVisible = false;
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64File(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },

    onRemove() {
      return new Promise((resolve) => {
        this.$confirm({
          title: this.confirmRemoveContent,
          icon: "warning",
          cancelText: "No",
          okText: "Yes",
          okType: "danger",
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });
    },

    onChange(info, validate) {
      if (validate) validate(info);
      const { file, fileList } = info;

      var responseData = [];

      switch (this.uploadType) {
        case "multiFile":
          this.listFiles = fileList.filter(
            (item) =>
              item.url ||
              ((item.type === "image/jpeg" || item.type === "image/png") &&
                item.size / 1024 ** 2 < this.maxFileSize)
          );

          responseData = fileList.filter((item) => item.response);
          this.$emit(
            "change",
            responseData.map(({ response }) => response)
          );
          break;

        default:
          if (file.status === "uploading") {
            this.loading = true;
            return;
          }

          if (file.status === "done") {
            this.$emit("change", {
              [this.type]: file.response.path,
            });

            this.getBase64(file.originFileObj, (imageUrl) => {
              this.imageUrl = imageUrl;
              this.loading = false;
            });
          }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-form-item {
    height: 100%;

    &-control-wrapper,
    &-control {
      height: 100%;
    }

    &-children {
      display: block;
      height: 100%;
    }
  }

  .ant-form-explain {
    padding: 8px;
    text-align: center;
  }
}

.upload-input {
  width: 100%;
  height: 100%;
}

.avatar-uploader {
  height: 100%;
  padding: 12px;

  .upload-pic {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    top: 12px;
    left: 12px;
  }
}

.image-uploader {
  .image-uploaded {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 245px;
  }
}
</style>
