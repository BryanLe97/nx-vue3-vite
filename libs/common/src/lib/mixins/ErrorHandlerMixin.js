import get from "lodash/get";

export default {
  name: "ErrorHandlerMixin",

  methods: {
    displayErrorNotification(err) {
      if (!err || !err.response) {
        this.$notification.error({ message: "Errors encountered." });
        return;
      }

      const { status } = err.response;

      if (status == "401") {
        this.$notification.error({
          message: "You don't have permissions to perform this action.",
        });

        return;
      }

      if (status == "409") {
        this.$notification.warning({
          message: "Importing...",
        });

        return;
      }

      const requestCorrelationId = err.response.headers["request-correlation-id"];

      if (requestCorrelationId) {
        const h = this.$createElement;

        const message =
          get(err, "response.data.message") ||
          h("div", [
            h(
              "div",
              "Something went wrong. Please provide Silicon Stack support staff with the following request id:"
            ),
            h("div", [h("b", `${requestCorrelationId}`)]),
          ]);

        const style = get(err, "response.data.message")
          ? undefined
          : { marginLeft: `${375 - 450}px`, width: "450px" };

        this.$notification.error({ message, style });

        return;
      }

      this.$notification.error({ message: "Errors encountered." });
    },
  },
}
