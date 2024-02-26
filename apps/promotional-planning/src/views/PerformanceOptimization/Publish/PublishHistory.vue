<template>
  <div class="publish-history__container">
    <p v-if="!viewOnly" class="neutral-9--text">History</p>
    <a-table
      bordered
      :columns="columns"
      :data-source="history"
      :pagination="false"
      row-key="id"
      :scroll="{ y: 250 }"
    >
      <template #startDate="startDate">
        {{ startDate | moment(PROMO_DATE_FORMAT_FOR_SALE) }}
      </template>

      <template #createdAt="createdAt">
        {{ createdAt | moment(FORMAT_DATE_PRIMARY) }}
      </template>

      <template #comment="record">
        <a-tooltip>
          <template #title>
            <template v-for="field in record.listComment">
              {{ field + "\n" }}
            </template>
          </template>
          <div class="comment-field__content text-truncate">
            {{ record.comment }}
          </div>
        </a-tooltip>
      </template>

      <template #promotionStatus="record">
        <tag-field
          :color="PROMO_STATUS_COLORS[record.promotionStatusCode]"
          :value="record.promotionStatusName"
        />
      </template>

      <template #action="record">
        <template v-if="record.id === selectedItem">
          <a-tooltip>
            <template #title>Click OK to confirm the update</template>
            <a-icon type="highlight" />
          </a-tooltip>
        </template>

        <template v-else>
          <a-tooltip>
            <template
              v-if="isEndInFuture(record) && !checkEditByPlanId(record)"
              #title
            >
              Update
            </template>
            <a-button
              icon="edit"
              size="small"
              type="link"
              :disabled="checkEditByPlanId(record)"
              @click="editItem(record)"
            />
          </a-tooltip>

          <a-tooltip v-if="canDelete" title="Delete">
            <a-button
              icon="delete"
              size="small"
              type="link"
              @click="onDeleteEntry(record)"
            />
          </a-tooltip>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import {
  DEL_ITEM_PERMISSION,
  FORMAT_DATE_PRIMARY,
  PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_DETAIL,
} from "@kraftheinz/common";

import { PROMO_STATUS_COLORS, PROMO_DATE_FORMAT_FOR_SALE } from "@/constants";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "PublishHistory",

  props: {
    history: {
      type: Array,
      default: null,
    },
    selectedItem: {
      type: Number,
      default: null,
    },
    planId: {
      type: [String, Number],
      default: null,
    },
    viewOnly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const columns = [
      {
        dataIndex: "id",
        key: "Id",
        title: "No.",
        width: 70,
      },
      {
        dataIndex: "scenarioName",
        key: "ScenarioName",
        title: "Scenario Name",
      },
      {
        dataIndex: "promotionType",
        key: "PromotionType",
        title: "Promo Type",
      },
      {
        dataIndex: "startDate",
        key: "StartDate",
        title: "From Week",
        scopedSlots: {
          customRender: "startDate",
        },
      },
      {
        dataIndex: "endDate",
        key: "EndDate",
        title: "To Week",
        customRender: (value) => {
          if (!value) return "";

          /** When publishing, we send the last day of the selected "To week" to the API.
           * Then, on this table, we need to get the first day of that week to display correctly.
           */
          return {
            children: this.$moment(value)
              .startOf("isoWeek")
              .format(PROMO_DATE_FORMAT_FOR_SALE),
          };
        },
      },
      {
        dataIndex: "createdAt",
        key: "CreatedAt",
        title: "Published Date",
        scopedSlots: {
          customRender: "createdAt",
        },
      },
      {
        dataIndex: "createdBy",
        key: "CreatedBy",
        title: "Published By",
      },
      {
        key: "Comment",
        title: "Comment",
        scopedSlots: { customRender: "comment" },
      },
      {
        key: "PromotionStatusName",
        title: "Status",
        width: 150,
        scopedSlots: { customRender: "promotionStatus" },
      },
      {
        title: "Action",
        width: 70,
        key: "action",
        align: "center",
        scopedSlots: { customRender: "action" },
      },
    ];

    return {
      FORMAT_DATE_PRIMARY,
      PROMO_STATUS_COLORS,
      PROMO_DATE_FORMAT_FOR_SALE,
      apiUrl,
      columns,
    };
  },

  computed: {
    canDelete() {
      return this.$can(
        DEL_ITEM_PERMISSION,
        PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_DETAIL
      );
    },
  },

  mounted() {
    if (this.viewOnly) {
      this.columns = this.columns.filter((col) => col.key !== "action");
    }
  },

  methods: {
    isEndInFuture(item) {
      const { endDate } = item;
      const today = this.$moment().endOf("day");
      return endDate && today.isBefore(endDate, "day");
    },

    checkEditByPlanId(item) {
      const { planId } = item;
      return this.planId !== planId;
    },

    editItem(item) {
      this.$emit("on-edit", item);
    },

    deleteEntry(id) {
      const endpoint = `${this.apiUrl}/promotion-planning/promo-optis/entry/${id}`;

      return this.axios
        .delete(endpoint)
        .then(() => this.$emit("delete-entry"))
        .catch((err) =>
          this.$notification["error"]({
            message:
              err.response.data.message ||
              "Something went wrong, please try again",
          })
        );
    },

    onDeleteEntry(entry) {
      this.$confirm({
        icon: "warning",
        title: `Are you sure to delete plan No. ${entry.id}?`,
        onOk: async () => await this.deleteEntry(entry.id),
      });
    },
  },
};
</script>

<style lang="scss">
.ant-tooltip {
  .ant-tooltip-inner {
    white-space: pre-line;
  }
}
</style>
