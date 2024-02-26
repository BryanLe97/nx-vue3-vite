<template>
  <div
    ref="content"
    class="comment-view"
    :class="isFetching ? 'is-fetching' : ''"
  >
    <a-list
      v-if="!isFetching && commentList && commentList.length"
      :data-source="commentList"
      item-layout="horizontal"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="item, index"
        :keys="item.id"
        class="custom-content"
      >
        <a-comment>
          <span slot="author" style="color: black;">
            {{ item.author }} -
            <h3 class="h3-custom" style="">
              {{ item.screenName }}
            </h3>
            <h3 class="h3-custom" v-if="item.planName">
              - {{ item.planName }}
            </h3>
            <a-icon
              v-if="checkCanDelete(item)"
              class="custom-content__close"
              type="close"
              @click="onDelete(item.id)"
            />
          </span>
          <a-avatar
            slot="avatar"
            :style="{
              backgroundColor: generateColor(item.author),
              verticalAlign: 'middle',
            }"
            >{{ item.avatar }}
          </a-avatar>
          <div slot="content" v-html="item.content" />
          <span>{{ item.datetime }}</span>
        </a-comment>
      </a-list-item>
    </a-list>
    <a-icon v-if="isFetching" type="loading" />
    <div v-else-if="!commentList || commentList.length == 0">
      <div class="d-flex flex-column align-items-center">
        <a-icon type="inbox" :style="{ fontSize: '44px' }" />
        <p class="ant-empty-description">No Data</p>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthTypes } from "@kraftheinz/common";
export default {
  props: {
    commentList: {
      type: Array,
      default: null,
    },
    pagination: {
      type: Object,
      default: null,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentHeight: 0,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.content.scrollTop = this.currentHeight = this.$refs.content.scrollHeight;
      // Add a scroll event listener to the container
      this.$refs.content.addEventListener("scroll", this.handleScroll);
    });
  },

  computed: {
    userInfo() {
      const { namespace, AUTH_GET_USER } = AuthTypes;
      return this.$store.getters[`${namespace}/${AUTH_GET_USER}`];
    },
  },

  updated() {
    this.$refs.content.scrollTop = Math.abs(
      this.currentHeight - this.$refs.content.scrollHeight
    );
    this.currentHeight = +this.$refs.content.scrollHeight;
  },

  beforeDestroy() {
    // Remove the scroll event listener to avoid memory leaks
    this.$refs.content.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    generateColor(param) {
      const colorHash = this.stringToHash(param);

      // Take the first 6 characters of the hash as the RGB color code
      const colorCode = colorHash.substring(0, 6);

      // Convert hex to RGB
      const r = parseInt(colorCode.substring(0, 2), 16);
      const g = parseInt(colorCode.substring(2, 4), 16);
      const b = parseInt(colorCode.substring(4, 6), 16);

      return `rgb(${r}, ${g}, ${b})`;
    },

    stringToHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash &= hash; // Convert to 32bit integer
      }
      return hash.toString(16);
    },

    onDelete(id) {
      this.$emit("onDelete", id);
    },

    handleInfiniteOnLoad() {
      this.$emit("onInfiniteOnLoad");
    },

    loadMoreContent() {
      this.$emit("onLoadMoreContent", (this.pagination.current += 1).toFixed());
    },

    handleScroll() {
      const content = this.$refs.content;
      if (
        this.pagination.total / this.pagination.pageSize <
        this.pagination.current
      )
        return;
      // Check if the user has scrolled to the top of the content container
      if (content.scrollTop === 0) {
        this.loadMoreContent();
      }
    },

    checkCanDelete(item) {
      if (!this.canDelete) {
        return this.userInfo.userName == item.createdBy;
      } else {
        return !item.isEntryComment;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.comment-view {
  height: 400px;
  overflow: scroll;
  &.is-fetching {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custom-content {
    display: block !important;
    position: relative;
    &__close {
      color: red;
      position: absolute;
      right: 5px;
      top: 5px;
    }
    .h3-custom {
      color: #ccc;
      display: inline;
    }
    ::v-deep {
      .ant-comment-content {
        border: 1px solid;
        padding: 8px;
        p {
          margin-bottom: 0px;
        }
      }
      .ant-comment-inner {
        padding: 0px;
      }
    }
  }
}
</style>
