/**
 * Defaults - Default attributes for the List view
 *
 * @return {Object} An object containing props and methods
 */
export default () => {
  /**
   * List View default composer options
   */
  const composer = {
    componentPropKeys: [
      "title",
      "search-by",
      "create-button-text",
      "show-clear-filters-button",
      "ph-search-by",
      "custom-url",
      "custom-query",
      "custom-table-row",
      "row-key",
      "custom-button",
      "has-active",
      "has-delete",
      "hide-pagination",
      "scroll",
      "actions-width",
      "custom-padding-table",
      "custom-padding-top",
      "source-delete",
      "has-delete-deactive",
      "has-size-changer",
      "has-filter-inactive",
      "has-custom-filter-inactive",
      "list-detail-of",
      "has-edit-in-row",
      "custom-url-edit-in-row",
      "label-item-count",
      "config-delete",
      "has-advanced-search",
      "data-source",
      "selected-row-keys",
      "on-select-change",
      "disabled-row",
      "custom-col",
      "has-action",
      "custom-margin-filter",
      "loading",
      "filters",
      "dynamic-columns",
      "url-tracking-column",
      "tracking-columns",
      "fetch-on-first-mount",
      "default-filters",
      "default-query-strings",
      "reference",
      "set-first-page-on-change-page-size"
    ],
  };

  return {
    composer,
  };
};
