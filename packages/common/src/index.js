import * as components from "./components";

const install = (Vue, options = {}) => {
  Object.values(components).map((component) => {
    let name = options.prefix
      ? options.prefix + component.name
      : component.name;

    Vue.component(name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default install;
export * from "./components";
export * from "./constants";
export * from "./mixins";
export * from "./store";
export * from "./utils";
