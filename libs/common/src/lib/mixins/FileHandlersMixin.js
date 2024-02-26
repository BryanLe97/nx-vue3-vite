export default {
  methods: {
    async downloadFile(url, type = "text/plain", params) {
      try {
        const { data, headers } = await this.axios.get(url, {
          params,
          responseType: "blob",
        });

        const blob = new Blob([data], { type });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", objectUrl);
        link.setAttribute("download", headers.filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        if (typeof this.displayErrorNotification == "function") {
          this.displayErrorNotification(error);
        }

        return Promise.reject(error);
      }
    },
  },
};
