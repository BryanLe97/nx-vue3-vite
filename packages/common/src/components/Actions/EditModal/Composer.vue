<script>
  import composeView from "../compose";
  import EditModal from "./EditModal";
  import componentPropKeys from "./defaults.js";

  export default {
    name: "EditModalComposer",
    functional: true,
    render(createElement, context) {
      return composeView(createElement, context, {
        component: EditModal,
        componentPropKeys,
      });
    },
  };
</script>
