import _ from "lodash";

/**
 * Compose - Given a function that creates VNodes and a context, composes the
 * View using it's default values
 *
 * @param {Function} createElement  The first param of the render function
 * @param {Object}   context        The second param of the render function
 * @param {Object}   component      A view component to be wrapped
 * @param {String}   view           The name of the view that is being composed
 *
 * @return {VNode} A Vue component
 */
export default (createElement, context, { component }) => {
  const { composer } = require(`./${component.name}/defaults.js`).default();
  const { componentPropKeys } = composer;

  return compose(createElement, context, {
    component,
    componentPropKeys,
  });
};

/**
 * compose - Given a createElement function, a context and a set of options,
 * composes the 'component' using the given options
 *
 * @param {Function} createElement   A function that creates VNodes
 * @param {Object}   context         The render context
 * @param {Object}   component       A Vue component
 * @param {Array}    parentPropKeys  The keys to extract from the parent
 *
 * @return {VNode} A Vue component
 */
function compose(createElement, context, { component, componentPropKeys }) {
  // If the View is being used in a user template it should contain children with
  // a source property, then they are processed and passed as props to the
  // View component
  if (context.children) {
    // Gets the context children and the parent component associated by Resource
    // during the binding.
    const {
      children,
      data: { attrs: componentAttrs = {}, on },
      scopedSlots,
    } = context;

    // Extracts the component props that should be passed to itself
    const componentProps = componentPropKeys.reduce((props, key) => {
      props[_.camelCase(key)] = componentAttrs[key];
      return props;
    }, {});

    // Composes the View children into an array of elements
    const fields = children.map((child) => {
      const { componentOptions, data } = child;
      const { attrs = {} } = data;

      let propsData, tag;

      propsData = _.get(componentOptions, 'propsData', {});
      tag = _.get(componentOptions, 'tag', child.tag);

      let childrenProps = Object.keys(data).reduce((props, key) => {
        // Remove event handler and hooks
        if (key != "on" || key != "hook") {
          props[_.camelCase(key)] = data[key];
        }

        return props;
      }, {});

      childrenProps = Object.keys(attrs).reduce((props, key) => {
        props[_.camelCase(key)] = attrs[key];
        return props;
      }, childrenProps);

      childrenProps = Object.keys(propsData).reduce((props, key) => {
        props[_.camelCase(key)] = propsData[key];
        return props;
      }, childrenProps);

      return { ...childrenProps, tag };
    });

    const props = { ...componentProps, fields, children, slotNames: Object.keys(scopedSlots), };
    return createElement(component, { props, scopedSlots, on });
  }

  // The View is already being instanced by Resource as an Array
  return createElement(component, context);
}
