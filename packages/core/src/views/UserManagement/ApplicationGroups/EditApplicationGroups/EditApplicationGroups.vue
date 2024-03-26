<template>
  <simple-form v-slot="{ handleSubmit }">
    <a-modal
      v-model="visible"
      :after-close="afterModalClose"
      destroy-on-close
      title="Edit Group"
      :width="520"
    >
      <a-row>
        <a-col
          v-for="name in entity.appGroupNames"
          :key="name.languageCode"
          :span="24"
        >
          <text-input
            :label="parseLabelName(name.languageCode)"
            form-item
            :value="name.name"
            :rules="name.languageCode === defaultNameLangCode ? 'required' : ''"
            @change="onNameChange(name.languageCode, $event)"
          />
        </a-col>
        <a-col :span="24">
          <radio-group-input
            label="Default Name"
            :data-source="languages"
            source="languageCode"
            source-label="nameInEnglish"
            form-item
            :value="defaultNameLangCode"
            @change="onDefaultLangNameChange"
          />
        </a-col>
        <a-col :span="24">
          <select-input
            form-item
            reference="identities.common.app-group-color-list"
            source="id"
            :source-label="generateLabel"
            source-description="colorCode"
            tag-color="colorCode"
            rules="required"
            label="Group Color"
            placeholder="Select Group Color"
            :span="24"
            :value="entity.colorId"
            @change="storeValue('colorId', $event)"
          />
        </a-col>
        <a-col :span="24">
          <text-area
            form-item
            label="Group Description"
            placeholder="Type Group Description"
            :rows="5"
            :span="24"
            :value="entity.description"
            @change="storeValue('description', $event)"
          />
        </a-col>
      </a-row>

      <template #footer>
        <a-button @click="cancel">Cancel</a-button>
        <a-button type="primary" @click="handleSubmit(submit)">
          Save
        </a-button>
      </template>
    </a-modal>
  </simple-form>
</template>

<script>
import { ErrorHandlerMixin } from "@kraftheinz/common";

export default {
  name: "EditApplicationGroups",

  inject: ["redirectRoute", "crud", "apiUrl"],

  mixins: [ErrorHandlerMixin],

  data() {
    return {
      visible: false,
      appGroupNames: [],
      languages: [],
      editForm: {},
      defaultNameLangCode: "",
    };
  },
  computed: {
    entity() {
      return this.crud.getEntity();
    },
  },

  created() {
    this.getListLanguage();
  },

  async mounted() {
    await this.crud.fetchEntity();
    this.defaultNameLangCode = this.entity.codeLangDefault;
    this.appGroupNames = this.entity.appGroupNames;
    this.visible = true;
    this.storeValues(this.entity);
  },

  methods: {
    parseLabelName(langCode) {
      const appName = this.languages.find(
        (language) => language.languageCode === langCode
      );
      if (appName) return `Name in ${appName.nameInEnglish}`;
      return "";
    },

    generateLabel(option) {
      var { colorName, applicationGroupId } = option;

      if (this.entity && this.entity.colorId === option.id) {
        colorName = colorName + " (CURRENT)";
        return colorName;
      }
      if (applicationGroupId !== null) colorName = colorName + " (USED)";

      return colorName;
    },

    async getListLanguage() {
      try {
        const { data } = await this.axios.get(
          `${this.apiUrl}/identities/common/portal/languages`
        );
        if (data) {
          this.languages = data.results;
        }
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    storeValue(resourceKey, value) {
      const editForm = this.editForm;

      this.editForm = {
        ...editForm,
        [resourceKey]: value,
      };

      this.crud.updateEntity("editForm", { resourceKey, value });
    },

    storeValues(entity) {
      if (entity) {
        Object.entries(entity).forEach(([key, value]) =>
          this.storeValue(key, value)
        );
      }
    },

    onDefaultLangNameChange(value) {
      this.defaultNameLangCode = value;
      this.storeValue("codeLangDefault", value);
    },

    onNameChange(code, value) {
      const existedName = this.appGroupNames.find(
        (app) => app.languageCode === code
      );

      if (existedName) {
        this.appGroupNames.map((app) => {
          if (app.languageCode === code) app.name = value;
        });
      } else {
        this.appGroupNames.push({ languageCode: code, name: value });
      }

      this.storeValue("appGroupNames", this.appGroupNames);
    },

    cancel() {
      this.visible = false;
    },

    async submit() {
      await this.crud.submitEntity("replace");

      const pageSize = this.crud.getPagination().pageSize;

      this.crud.setPagination({ page: 1, pageSize });
      this.crud.fetchList();
      this.visible = false;
    },

    afterModalClose() {
      this.crud.clearEntity("editForm");

      const redirectRoute = this.redirectRoute.includes(":id")
        ? this.redirectRoute.replace(":id", this.newEntityId)
        : this.redirectRoute;

      this.$router.push(redirectRoute);
    },
  },
};
</script>

<style></style>
