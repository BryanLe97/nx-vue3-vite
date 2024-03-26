<template>
  <simple-form v-slot="{ handleSubmit }">
    <a-modal
      v-model="visible"
      :after-close="afterModalClose"
      destroy-on-close
      title="Add Group"
      :width="520"
    >
      <a-row>
        <a-col
          v-for="language in languages"
          :key="language.languageCode"
          :span="24"
        >
          <text-input
            :label="`Name in ${language.nameInEnglish}`"
            form-item
            :rules="
              language.languageCode === defaultNameLangCode ? 'required' : ''
            "
            @change="onNameChange(language.languageCode, $event)"
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
            @change="storeValue('description', $event)"
          />
        </a-col>
      </a-row>

      <template #footer>
        <a-button @click="cancel">Cancel</a-button>
        <a-button type="primary" @click="handleSubmit(submit)">
          Add
        </a-button>
      </template>
    </a-modal>
  </simple-form>
</template>

<script>
import { ErrorHandlerMixin } from "@kraftheinz/common";

export default {
  name: "CreateApplicationGroups",

  inject: ["resourceName", "redirectRoute", "crud", "apiUrl"],

  mixins: [ErrorHandlerMixin],

  data() {
    return {
      visible: false,
      appGroupNames: [],
      languages: [],
      createForm: {},
      defaultNameLangCode: "en",
    };
  },

  computed: {
    isLoading() {
      return this.$store.state[this.resourceName].isCreating;
    },
  },

  created() {
    this.getListLanguage();
    this.storeValue("codeLangDefault", this.defaultNameLangCode);
  },

  mounted() {
    this.visible = true;
  },

  methods: {
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

    generateLabel(option) {
      var { colorName, applicationGroupId } = option;

      if (this.entity && this.entity.colorId === option.id) {
        colorName = colorName + " (CURRENT)";
        return colorName;
      }
      if (applicationGroupId !== null) colorName = colorName + " (USED)";

      return colorName;
    },

    storeValue(resourceKey, value) {
      const createForm = this.createForm;

      this.createForm = {
        ...createForm,
        [resourceKey]: value,
      };

      this.crud.updateEntity("createForm", { resourceKey, value });
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
      await this.crud.submitEntity("create");

      const pageSize = this.crud.getPagination().pageSize;

      this.crud.setPagination({ page: 1, pageSize });
      this.crud.fetchList();
      this.visible = false;
    },

    afterModalClose() {
      this.crud.clearEntity("createForm");

      const redirectRoute = this.redirectRoute.includes(":id")
        ? this.redirectRoute.replace(":id", this.newEntityId)
        : this.redirectRoute;

      this.$router.push(redirectRoute);
    },
  },
};
</script>

<style></style>
