/**
 * Defaults - Default attributes for the Filter view
 *
 * @return {Object} An object containing props and methods
 */
export default () => {
  /**
   * Edit View default composer options
   */
  const composer = {
    componentPropKeys: [
      "custom-url",
      "default-filters",
      "default-query-strings",
      "has-filter-inactive",
      "is-advanced-filtered",
      "lazy",
      "reference",
    ],
  };

  return {
    composer,
  };
};
