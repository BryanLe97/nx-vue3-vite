import composeView from "@/components/Actions/compose";
import componentPropKeys from "./defaults.js"

import List from "./List";

export default {
  functional: true,

  name: "ListComposer",

  render(createElement, context) {
    return composeView(createElement, context, { component: List, componentPropKeys });
  },
};
