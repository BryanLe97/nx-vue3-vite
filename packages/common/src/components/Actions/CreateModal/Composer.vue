<script>
  import composeView from "../compose";
  import CreateModal from "./CreateModal";
  import componentPropKeys from "./defaults.js";

  export default {
    name: "CreateModalComposer",
    functional: true,
    render(createElement, context) {
      return composeView(createElement, context, {
        component: CreateModal,
        componentPropKeys,
      });
    },
  };
</script>
