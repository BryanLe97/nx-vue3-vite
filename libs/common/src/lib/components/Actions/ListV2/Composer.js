import composeView from "@/components/Actions/compose";

import ListV2 from "./ListV2";

export default {
  functional: true,

  name: "ListComposerV2",

  render(createElement, context) {
    return composeView(createElement, context, { component: ListV2 });
  },
};
