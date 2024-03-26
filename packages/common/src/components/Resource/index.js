import Resource from "./Resource";

Resource.install = (Vue) => {
  Vue.component(Resource.name, Resource);
};

export default Resource;
