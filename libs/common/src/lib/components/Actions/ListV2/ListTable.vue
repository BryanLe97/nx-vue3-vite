<script>
export default {
  name: "ListV2",

  emits: ["edit", "delete"],

  props: {
    children: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    customRow: {
      type: Function,
      default: () => ({}),
    },
    disabledRow: {
      type: Function,
      default: undefined,
    },
    hideShowColumnOptions: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: [Object, Boolean],
      default: false,
    },
    rowKey: {
      type: [String, Function],
      default: "id",
    },
    rowSelection: {
      type: Object,
      default: undefined,
    },
    scroll: {
      type: Object,
      default: undefined,
    },
    showedColumnKeys: {
      type: Array,
      default: () => [],
    },
    sorter: {
      type: Object,
      default: () => ({}),
    },
    tableChangeHandler: {
      type: Function,
      default: () => ({}),
    },
  },

  methods: {
    isTrue(record, dataIndex, defaultValue = false) {
      return !(dataIndex in record)
        ? defaultValue
        : typeof record[dataIndex] !== "string"
        ? !!record[dataIndex]
        : record[dataIndex] === "";
    },

    generateColumns(children) {
      return children.reduce((columns, child) => {
        const { componentOptions } = child;
        const key = child.key;
        const propsData = componentOptions.propsData;
        const scopedSlots = child.data.scopedSlots;
        const tag = componentOptions.tag;

        const visible =
          this.isTrue(propsData, "visible", true) &&
          (!this.hideShowColumnOptions.length ||
            this.showedColumnKeys.includes(propsData.dataIndex));

        if (visible) {
          const column = {
            ...propsData,
            ...(tag === "column-group"
              ? {
                  children: this.generateColumns(componentOptions.children),
                }
              : {}),
            align: tag === "action-column" ? "center" : propsData.align,
            component: {
              children: componentOptions.children,
              data: child.data,
              listeners: componentOptions.listeners,
              propsData: componentOptions.propsData,
              tag,
            },
            ellipsis: this.isTrue(propsData, "ellipsis"),
            key: key ? key : propsData.dataIndex,
            sorter: this.isTrue(propsData, "sorter"),
            sortOrder: key === this.sorter.columnKey && this.sorter.order,
            title:
              scopedSlots && scopedSlots.title ? undefined : propsData.title,
            width: tag === "action-column" ? 100 : propsData.width,
            scopedSlots: { customRender: propsData.dataIndex },
            slots: {
              title:
                !scopedSlots || !scopedSlots.title
                  ? undefined
                  : tag === "action-column"
                  ? "actionTitle"
                  : `${propsData.dataIndex}Title`,
            },
          };

          return [...columns, column];
        }

        return columns;
      }, []);
    },

    generateScopedSlots(h, columns) {
      return columns.reduce(
        (slots, column) => ({
          ...slots,
          // default slots
          [column.scopedSlots.customRender]: (...props) =>
            h(column.component.tag, {
              ...column.component.data,
              on: {
                ...(column.component.tag === "action-column"
                  ? {
                      delete: (...args) => this.$emit("delete", ...args),
                      edit: (...args) => this.$emit("edit", ...args),
                    }
                  : {}),
                ...column.component.listeners,
              },
              props: {
                disabled:
                  props[1] && this.disabledRow && this.disabledRow.props[1],
                record: props[1] ? props[1] : "",
                value: props[0] ? props[0] : "",
                parse: column.parse,
                ...column.component.propsData,
              },
              scopedSlots: {
                ...column.component.data.scopedSlots,
                // Render children slot when without using <template #default>
                ...(column.component.children
                  ? {
                      default: () =>
                        h(
                          "div",
                          {
                            class: `list__${column.component.tag}-children`,
                            on: { ...column.component.listeners },
                            props: { ...column.component.propsData },
                          },
                          column.component.children
                        ),
                    }
                  : {}),
              },
            }),
          // title slots
          ...(column.slots.title
            ? {
                [column.slots.title]: column.component.data.scopedSlots.title,
              }
            : {}),
          // children slots
          ...(column.component.tag === "column-group"
            ? this.generateScopedSlots(h, column.children)
            : {}),
        }),
        {}
      );
    },
  },

  render(h) {
    const columns = this.generateColumns(this.children);

    return h("a-table", {
      class: "list__table",
      on: {
        change: this.tableChangeHandler,
      },
      props: {
        bordered: true,
        columns,
        customRow: this.customRow,
        dataSource: this.dataSource,
        loading: this.loading,
        pagination: this.pagination,
        rowKey: this.rowKey,
        rowSelection: this.rowSelection,
        scroll: this.scroll,
      },
      scopedSlots: this.generateScopedSlots(h, columns),
    });
  },
};
</script>
