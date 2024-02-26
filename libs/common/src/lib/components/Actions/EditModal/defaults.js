/**
 * Defaults - Default attributes for the Edit view
 *
 * @return {Object} An object containing props and methods
 */
export default () => {
  /**
   * Edit View default composer options
   */
  const composer = {
    componentPropKeys: [
      "class-name",
      "config-delete",
      "custom-list-url",
      "custom-redirect-route",
      "custom-url",
      "entity-id",
      "has-deactivate-button",
      "has-delete-button",
      "has-last-modified",
      "is-fetch-entity-by-id",
      "key-receive-event",
      "last-modified-by-name",
      "reference",
      "title",
      "visible-custom-modal",
      "width",
    ],
  };

  return {
    composer,
  };
};
