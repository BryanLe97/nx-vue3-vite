<!-- Comment.vue -->
<template>
  <div>
    <div>
      <comment-view
        v-if="commentList.length > 0"
        :comment-list="commentList"
        :pagination="pagination"
        :is-fetching="isFetching"
        :can-delete="canDelete"
        @onLoadMoreContent="onLoadMoreContent"
        @onDelete="onDelete"
      />
    </div>
    <hr />
    <div v-if="canCreate">
      <div style="position: relative;" class="pl-4 mt-4">
        <div
          ref="textarea"
          class="w-100 input-area ml-3"
          contenteditable="true"
          placeholder="Type comment here"
          @input="onInput"
          @keydown="onKeyDown"
        />
        <div
          v-if="showSuggestions"
          ref="suggestions"
          class="suggestions p-2 "
          :style="{ top: `${caretY}px`, left: `${caretX}px` }"
        >
          Suggestions
          <hr />
          <div
            v-for="(suggestion, index) in mentionsList"
            class="suggestions__items"
            :key="suggestion.value"
            :class="{ 'active-suggestion': index === activeSuggestionIndex }"
          >
            <div class="my-2" @click="onSuggestionClick(suggestion)">
              {{ suggestion.text }}
            </div>
          </div>
        </div>
      </div>
      <slot name="action" :onClick="submitComment">
        <div class="d-flex justify-content-end">
          <button class="mt-4" @click="submitComment">
            Submit Comment
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import commentView from "./CommentView.vue";
export default {
  components: {
    commentView,
  },

  props: {
    rules: {
      type: [Object, String],
      default: "",
    },
    rows: {
      type: Number,
      default: 3,
    },
    mentionSuggestions: {
      type: Array,
      default: null,
    },
    propCommentList: {
      type: Array,
      default: null,
    },
    mentionPlacement: {
      type: String,
      default: "top",
    },
    isPosting: {
      type: Boolean,
      default: false,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
    canCreate: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      mentionsSelected: [],
      showSuggestions: false,
      caretX: 0,
      caretY: 0,
      activeSuggestionIndex: 0,
    };
  },

  computed: {
    mentionsList() {
      return this.mentionSuggestions;
    },
    commentList() {
      return this.propCommentList;
    },
  },

  watch: {
    isPosting(val) {
      !val && (this.$refs.textarea.innerText = "");
    },
  },

  methods: {
    submitComment() {
      this.$emit("onInput");
    },

    getMentionSuggestions(value) {
      this.activeSuggestionIndex = 0;
      this.$emit("onSearchMentions", value);
    },

    onSuggestionClick(suggestion) {
      if (
        !this.mentionsSelected.find(
          (mention) => mention.value == suggestion.value
        )
      ) {
        this.mentionsSelected.push(suggestion);
      }
      const { wordStart, wordEnd } = this.getStartEndWord();
      const text = this.$refs.textarea.innerHTML;
      // Find the start and end of the word at the caret position
      const textContent = `&nbsp;<span style="color: blue;">${suggestion.text}</span>&nbsp;`;
      this.$refs.textarea.innerHTML = `${text.substring(
        0,
        wordStart - 1
      )}${textContent}${text.substring(wordEnd + 1)}`;
      // Set the caret position to the end of the div
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(this.$refs.textarea);
      range.collapse(false); // false means collapse to the end
      selection.removeAllRanges();
      selection.addRange(range);

      this.showSuggestions = false;
      this.activeSuggestionIndex = 0;

      this.$emit(
        "onChange",
        this.$refs.textarea.innerHTML,
        this.mentionsSelected
      ); // Emit the current text to the parent component
    },

    onLoadMoreContent(page) {
      this.$emit("onLoadMoreContent", page);
    },

    onDelete(id) {
      this.$emit("onDelete", id);
    },

    onInput() {
      const text = this.$refs.textarea.innerHTML;
      this.mentionsSelected = this.mentionsSelected.filter((mention) =>
        text.includes(mention.text)
      );
      const { wordStart, wordEnd } = this.getStartEndWord();
      if (text.includes("@")) {
        this.$nextTick(() => {
          this.updateCaretPosition();
          this.getMentionSuggestions(
            text.slice(wordStart + 1, wordEnd).length > 0
              ? text.slice(wordStart + 1, wordEnd)
              : ""
          );
          this.showSuggestions = true;
        });
      } else {
        this.showSuggestions = false;
      }
      this.$emit(
        "onChange",
        this.$refs.textarea.innerHTML,
        this.mentionsSelected
      );
    },

    onKeyDown(event) {
      switch (event.key) {
        case "ArrowDown":
          if (this.activeSuggestionIndex == this.mentionsList.length - 1)
            return;
          this.activeSuggestionIndex = this.activeSuggestionIndex + 1;
          event.preventDefault();
          break;
        case "ArrowUp":
          if (this.activeSuggestionIndex == 0) return;
          this.activeSuggestionIndex = this.activeSuggestionIndex - 1;
          event.preventDefault();
          break;
        case "Backspace":
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const parentElement = range.commonAncestorContainer.parentElement;
            if (parentElement && parentElement.tagName === "SPAN") {
              // Remove the span element
              parentElement.remove();
              // Remove the mention from the mentions array
              const mention = parentElement.innerText.slice(1); // Remove the '@' from the mention
              const index = this.mentionsSelected.findIndex(
                (m) => m.text == mention
              );
              if (index !== -1) {
                this.mentionsSelected.splice(index, 1);
              }
              // Prevent the default backspace behavior
              event.preventDefault();
            }
          }
          break;
        case "Enter":
          if (!this.showSuggestions) break;
          this.onSuggestionClick(this.mentionsList[this.activeSuggestionIndex]);
          if (event.shiftKey && !this.showSuggestions) {
            this.submitComment();
          }
          event.preventDefault();
          break;
        case "Escape":
          if (this.showSuggestions) this.showSuggestions = false;
          break;
        default:
          break;
      }
    },

    getStartEndWord() {
      const text = this.$refs.textarea.innerHTML;
      const wordStart = text.indexOf("@");
      let wordEnd = text.indexOf(" ", wordStart + 1);
      if (wordEnd === -1) wordEnd = text.length;
      return { wordStart, wordEnd };
    },

    updateCaretPosition() {
      const text = this.$refs.textarea;
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const tempEl = document.createElement("span");
      range.insertNode(tempEl);
      const { top, left, height } = tempEl.getBoundingClientRect();
      this.caretY = -(tempEl.offsetHeight + height - text.offsetHeight + 100);
      this.caretX = tempEl.offsetWidth + left - 280; // Add the width of the span to position the suggestions right behind the caret
      tempEl.parentNode.removeChild(tempEl);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-area {
  width: 100%;
  min-height: 60px;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  resize: both;
  font-family: inherit;
  font-size: inherit;
  &[contenteditable="true"]:empty:before {
    content: attr(placeholder);
    pointer-events: none;
    display: block; /* For Firefox */
    color: #999;
  }
}

.suggestions {
  position: absolute;
  background-color: rgb(41, 41, 41);
  color: rgb(255, 255, 255);
  &__items {
    cursor: pointer;
    &:hover,
    &.active-suggestion {
      background-color: #ccc;
    }
  }
  /* Other styles... */
}

/* Add your custom styles here */
</style>
