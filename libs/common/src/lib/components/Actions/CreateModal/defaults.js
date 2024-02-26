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
      "custom-url",
      "custom-list-url",
      "key-receive-event",
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
