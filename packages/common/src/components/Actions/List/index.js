import List from "./Composer";

List.install = (Vue) => {
  Vue.component(List.name, List);
};

export default List;
