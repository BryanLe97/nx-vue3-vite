<template>
  <simple-form v-slot="{ handleSubmit }" ref="publishForm">
    <a-modal
      v-model="visibleModal"
      title="Publish to PP"
      :after-close="afterModalClose"
      :closable="!isLoading"
      :width="1000"
      class="publish-modal"
      @cancel="closeModal"
    >
      <div class="publish-modal__content">
        <a-row :gutter="[24, 16]">
          <a-col :xs="12" :md="8">
            <text-input
              label="Scenario"
              class="w-100"
              disabled
              form-item
              :value="planName"
            />
          </a-col>
          <a-col :xs="12" :md="16" :lg="8">
            <effective-week-range-picker
              :value="selectedDates"
              label="Effective Weeks"
              :placeholder="['From Week', 'To Week']"
              :rules="['required', 'required']"
              get-last-day-of-to-week
              @change="onChangeEffectiveWeek"
            />
          </a-col>
        </a-row>
        <a-row :gutter="[24, 16]">
          <a-col :xs="24" :md="24">
            <text-area
              :rows="5"
              :max-length="255"
              label="Comment"
              placeholder="Type Comment"
              :value="comment"
              @change="onCommentChange"
            />
          </a-col>
        </a-row>

        <a-row :gutter="[24, 16]">
          <a-col class="pt-0 pb-3">
            <publish-history
              :history="historyData"
              :selected-item="publishId"
              :plan-id="planId"
              @on-edit="onEdit"
              @delete-entry="onDeleteEntry"
            />
          </a-col>
        </a-row>
      </div>

      <template #footer>
        <a-button key="cancel" :disabled="isLoading" @click="closeModal">
          Cancel
        </a-button>
        <a-button
          key="submit"
          :disabled="isLoading"
          type="primary"
          @click="handleSubmit(publish)"
        >
          OK
        </a-button>
      </template>
    </a-modal>
  </simple-form>
</template>

<script>
import { ErrorHandlerMixin } from "@kraftheinz/common";
import EffectiveWeekRangePicker from "@/components/EffectiveWeekRangePicker.vue";
import PublishHistory from "./PublishHistory.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "Publish",

  mixins: [ErrorHandlerMixin],

  components: {
    EffectiveWeekRangePicker,
    PublishHistory,
  },

  inject: ["resourceProps", "fetchPublishHistoryPODetail"],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: [String, Number],
      default: null,
    },
    productId: {
      type: [String, Number],
      default: null,
    },
    planName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isLoading: false,
      historyData: [],
      startDate: "",
      endDate: "",
      selectedDates: [],
      publishId: null,
      visibleModal: this.visible,
      comment: null,
    };
  },

  watch: {
    visible(newVal) {
      this.visibleModal = newVal;

      if (newVal) {
        /** to clear the edit mode on the table */
        this.publishId = null;

        this.fetchPublishHistory();
      }
    },
  },

  methods: {
    onChangeEffectiveWeek(val) {
      if (!val) return;

      this.startDate = val[0] ?? null;
      this.endDate = val[1] ?? null;
    },

    async fetchPublishHistory() {
      try {
        const payload = {
          params: {
            planId: this.planId,
          },
        };

        this.isLoading = true;
        const res = await this.axios.get(
          `${apiUrl}/promotion-planning/promo-optis/${this.$route.params.id}/publish`,
          payload
        );

        if (res && res.data && res.data.results) {
          this.historyData = res.data.results;
        }
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoading = false;
      }
    },

    afterModalClose() {
      /** reset the form state after closing the modal */
      this.$refs.publishForm.resetForm();

      /** clear value of the effective-week-range-picker */
      this.selectedDates = [null, null];
      this.comment = null;
    },

    closeModal() {
      this.$emit("update:visible", false);
    },

    async publish() {
      const { id } = this.$route.params;

      /** publishId: if it has a value, this form is on edit mode, else this form is on add new mode */
      const payload = {
        planId: this.planId,
        startDate: this.startDate,
        endDate: this.endDate,
        publishId: this.publishId,
        comment: this.comment,
        productId: this.productId,
      };

      try {
        this.isLoading = true;
        await this.axios.post(
          `${apiUrl}/promotion-planning/promo-optis/${this.$route.params.id}/publish`,
          payload
        );

        /** emit a signal to podetail to refresh the metadata of published by... at... */
        this.$emit("publish-done");

        /** close the modal */
        this.$emit("update:visible", false);

        this.$notification.success({ message: "Item Published" });

        await this.fetchPublishHistoryPODetail();
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoading = false;
      }
    },

    onEdit(selectedItem) {
      if (!selectedItem) return;

      this.selectedDates = [selectedItem.startDate, selectedItem.endDate];
      this.publishId = selectedItem.id;
    },
    onCommentChange(value) {
      this.comment = value;
    },

    async onDeleteEntry() {
      this.$emit("refetch-after-delete");
      await this.fetchPublishHistory();
      await this.fetchPublishHistoryPODetail();
    },
  },
};
</script>
