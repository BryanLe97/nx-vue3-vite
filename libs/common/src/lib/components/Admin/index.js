import Admin from "./Admin";

Admin.install = (Vue) => {
  Vue.component(Admin.name, Admin);
};

export default Admin;
