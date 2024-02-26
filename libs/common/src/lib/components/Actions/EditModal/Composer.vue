<script>
import composeView from "../compose";
import EditModal from "./EditModal";

export default {
  name: "EditModalComposer",
  functional: true,
  render(createElement, context) {
    return composeView(createElement, context, { component: EditModal });
  },
};
</script>
