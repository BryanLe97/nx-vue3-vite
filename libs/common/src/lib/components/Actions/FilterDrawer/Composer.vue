<script>
import composeView from "../compose";
import FilterDrawer from "./FilterDrawer";

export default {
  name: "FilterDrawerComposer",
  functional: true,
  render(createElement, context) {
    return composeView(createElement, context, { component: FilterDrawer });
  },
};
</script>
