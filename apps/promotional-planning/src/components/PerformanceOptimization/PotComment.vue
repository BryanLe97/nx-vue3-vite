<template>
  <div class="pb-2" v-if="canSeeComment">
    <div class="body mx-5 mb-5">
      <a-card class="comment">
        <div class="d-flex align-items-center">
          <label class="font-weight-bold h5">Comment</label>
          <a-icon
            class="ml-2"
            :type="activeKey ? 'up' : 'down'"
            @click="toggleRow"
          />
        </div>
        <comment-input
          v-if="activeKey"
          :mention-suggestions="mentionSuggestions"
          :prop-comment="comment"
          :prop-comment-list="commentList"
          :is-posting="isPosting"
          :is-fetching="isFetchingList"
          :can-delete="canDelete"
          :can-create="canCreate"
          :pagination="pagination"
          @onLoadMoreContent="onLoadMoreContent"
          @onChange="onChange"
          @onSearchMentions="onSearchMentions"
          @onInput="onPostComment"
          @onDelete="onDelete"
        >
          <template #action="{onClick}">
            <div class="d-flex justify-content-end mt-4">
              <select-input
                allow-clear
                source="id"
                source-label="name"
                source-description="name"
                placeholder="Select Scenario"
                class="mr-2 cw-100"
                :data-source="plansList"
                :clear-data-on-destroy="false"
                :clear-value-on-options-change="false"
                @change="onFilterChange($event)"
              />
              <button @click="onClick">
                Post
              </button>
            </div>
          </template>
        </comment-input>
      </a-card>
    </div>
  </div>
</template>

<script>
import CommentInput from "@/views/Common/Comment/CommentInput.vue";
import {
  VIEW_PERMISSION,
  CREATE_PERMISSION,
  ErrorHandlerMixin,
  PayloadHandlerMixin,
  DEL_ITEM_PERMISSION,
  PROMOTIONAL_PLANNING_COMMENT,
} from "@kraftheinz/common";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CommentInput,
  },

  mixins: [PayloadHandlerMixin, ErrorHandlerMixin],
  inject: ["resourceProps"],

  data() {
    const [, , , planProps, , , commentProps] = this.resourceProps;
    const promoOptisProps = this.resourceProps.find(
      (item) => item.resourceName === "promotion-planning.promo-optis"
    );
    return {
      apiUrl,
      promoOptisProps,
      planProps,
      commentProps,
      mentionSuggestions: [],
      comment: "",
      commentList: [],
      activeKey: true,
      isPosting: false,
      mentionsSelected: [],
      plansSelected: 0,
    };
  },
  computed: {
    canSeeComment() {
      return this.$can(VIEW_PERMISSION, PROMOTIONAL_PLANNING_COMMENT);
    },

    canDelete() {
      return this.$can(DEL_ITEM_PERMISSION, PROMOTIONAL_PLANNING_COMMENT);
    },

    canCreate() {
      return this.$can(CREATE_PERMISSION, PROMOTIONAL_PLANNING_COMMENT);
    },

    promotionId() {
      return this.$route.params.id;
    },

    promoEntry() {
      if (this.promotionId) {
        return this.promoOptisProps.crud.getEntity();
      }
      return null;
    },

    pagination() {
      if (this.hidePagination) return false;

      const { page, count, pageSize } = this.commentProps.crud.getPagination();

      return {
        current: page,
        total: count,
        pageSize,
      };
    },

    plansList() {
      return this.planProps.crud.getList();
    },

    isFetchingList() {
      return this.commentProps.crud.getFetchingStatus();
    },
  },
  created() {
    this.commentProps.crud.deleteFilter("IsInactive");
    this.commentProps.crud.setQueryString(
      "fe",
      `((CustomerId Eq ${"`" +
        this.promoEntry.customerId +
        "`"})and(PPGCode Eq ${"`" + this.promoEntry.ppgCode + "`"}))`
    );
  },
  mounted() {
    this.fetchComment();
    this.fetchUser("");
  },
  methods: {
    async fetchComment() {
      try {
        await this.commentProps.crud.fetchList();
        const data = this.commentProps.crud.getList();
        if (!data) return;
        this.commentList = [
          ...data.reverse().map((item) => ({
            id: item.id,
            author: `${item.firstName} ${item.lastName}`,
            screenName: item.screenName,
            avatar: `${item.firstName[0]} ${item.lastName[0]}`,
            datetime: this.$moment(new Date(item.createdAt)).format(
              "DD/MM/YYYY, HH:mm A"
            ),
            content: item.content,
            planName: item.planName,
            isEntryComment: item.isEntryComment,
            createdBy: item.createdBy,
          })),
          ...this.commentList,
        ];
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async fetchUser(keyword) {
      try {
        this.mentionSuggestions = [];
        const feString = `fe=(IsInactive Eq ${"`false`"})and((FirstName Contains ${" `" +
          keyword +
          "`"})or(LastName Contains ${" `" + keyword + "`"}))`;
        const url = `${this.apiUrl}/identities/users-of-app?appCode=pl&pageSize=5&${feString}`;
        const { data } = await this.axios.get(url);
        if (data) {
          this.mentionSuggestions = data.results.map((item) => ({
            value: item.userName,
            text: `${item.firstName} ${item.lastName}`,
          }));
        }
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async deleteComment(id) {
      try {
        const url = `${this.apiUrl}/promotion-planning/comments/${id}`;
        await this.axios.delete(url);
        this.commentList = this.commentList.filter((val) => val.id != id);
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async onPostComment() {
      if (this.comment.length == 0) return;
      try {
        this.isPosting = true;
        const hostURL = `${window.location.protocol}//${window.location.host}`;
        const payload = {
          taggedUser: this.mentionsSelected,
          screenName: "POT",
          content: this.comment,
          planId: this.plansSelected,
          ppgCode: this.promoEntry.ppgCode,
          promotionId: +this.promotionId,
          hostUrl: hostURL,
        };
        const url = `${this.apiUrl}/promotion-planning/comments`;
        const { data } = await this.axios.post(url, payload);
        if (data) {
          this.commentList.push({
            id: data.id,
            author: `${data.firstName} ${data.lastName}`,
            avatar: `${data.firstName[0]} ${data.lastName[0]}`,
            screenName: data.screenName,
            datetime: this.$moment(data.createdAt).format(
              "DD/MM/YYYY, HH:mm A"
            ),
            content: data.content,
            planName: data.planName,
            createdBy: data.createdBy,
          });
        }
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isPosting = false;
      }
    },

    onFilterChange(id) {
      this.plansSelected = id;
    },

    async onDelete(id) {
      this.$confirm({
        title: "Warning",
        cancelText: "No",
        okText: "Yes",
        content: "Do you want to delete this comment ?",
        onOk: () => this.deleteComment(id),
      });
    },

    onLoadMoreContent(page) {
      this.commentProps.crud.setPagination({
        ...this.pagination,
        page: page,
      });
      this.fetchComment();
    },

    toggleRow() {
      this.activeKey = !this.activeKey;
    },

    onSearchMentions(val) {
      this.fetchUser(val);
    },

    onChange(val, mentionsSelected) {
      this.comment = val;
      this.mentionsSelected = mentionsSelected.map((mention) => mention.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.cw-100 {
  min-width: 150px;
}
</style>
