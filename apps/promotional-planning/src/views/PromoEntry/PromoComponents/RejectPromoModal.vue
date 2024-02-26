<template>
  <simple-form v-slot="{ handleSubmit, reset }">
    <a-modal
      v-model="visible"
      :after-close="afterModalClose"
      :footer="null"
      :closable="false"
      :mask-closable="false"
    >
      <a-row :gutter="16" class="mt-2">
        <a-col :span="2">
          <a-icon
            type="exclamation-circle"
            :style="{ color: '#FA8C16', fontSize: '21px' }"
          />
        </a-col>
        <a-col :span="22">
          <h5 class="h6 neutral-9--text">You are rejecting this plan</h5>
          <p>Please leave a comment below.</p>
          <text-area
            label="Comment"
            :show-label="false"
            form-item
            required
            rules="required"
            :max-length="255"
            :rows="5"
            placeholder="Comment"
            :value="comment"
            @change="onChangeComment"
          ></text-area>
        </a-col>
      </a-row>
      <a-row :gutter="[16]" type="flex" justify="end" class="mb-2">
        <a-col>
          <a-button class="mr-2" @click="cancel(reset)">Cancel</a-button>
          <a-button
            :loading="isLoading"
            type="danger"
            @click="handleSubmit(onReject)"
          >
            Reject
          </a-button>
        </a-col>
      </a-row>
    </a-modal>
  </simple-form>
</template>

<script>
import { ErrorHandlerMixin } from "@kraftheinz/common";
import { URL_PP_APPROVE } from "@/constants/api-endpoints";
import { REJECT_SUCCESS } from "@/constants/pp.status";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "RejectPromoModal",

  mixins: [ErrorHandlerMixin],

  props: {
    visibleReject: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      URL_PP_APPROVE,
      visible: false,
      isLoading: false,
      comment: "",
    };
  },

  watch: {
    visibleReject(newVal) {
      this.visible = newVal;
    },
  },

  methods: {
    cancel(resetForm) {
      resetForm();
      this.comment = null;
      this.visible = false;
    },

    async onReject() {
      const promoId = this.$route.params.id;

      const payload = {
        publishId: promoId,
        isApprove: false,
        comment: this.comment,
      };

      try {
        this.isLoading = true;
        await this.axios.post(apiUrl + URL_PP_APPROVE, payload);

        this.visible = false;
        this.$notification.success({ message: REJECT_SUCCESS });
        this.$router.push({ name: "LandingPage" });
      } catch (err) {
        this.displayErrorNotification(err);
        this.visible = false;
      } finally {
        this.isLoading = false;
      }
    },

    afterModalClose() {
      this.$emit("update:visible-reject", false);
    },

    onChangeComment(val) {
      this.comment = val;
    },
  },
};
</script>
