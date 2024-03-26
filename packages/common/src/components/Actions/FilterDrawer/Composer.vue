<script>
  import composeView from "../compose";
  import FilterDrawer from "./FilterDrawer";
  import componentPropKeys from "./defaults.js";

  export default {
    name: "FilterDrawerComposer",
    functional: true,
    render(createElement, context) {
      return composeView(createElement, context, {
        component: FilterDrawer,
        componentPropKeys,
      });
    },
  };
</script>
