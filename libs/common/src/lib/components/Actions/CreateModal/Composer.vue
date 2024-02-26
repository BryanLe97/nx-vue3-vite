<script>
import composeView from "../compose";
import CreateModal from "./CreateModal";

export default {
  name: "CreateModalComposer",
  functional: true,
  render(createElement, context) {
    return composeView(createElement, context, { component: CreateModal });
  },
};
</script>
