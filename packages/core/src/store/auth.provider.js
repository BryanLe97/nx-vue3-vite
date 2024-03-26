import { AuthTypes } from "@kraftheinz/common";

export default (client, options = {}) => {
  return (type) => {
    const {
      AUTH_CHECK_REQUEST,
      AUTH_LOGIN_REQUEST,
      AUTH_GET_OPERATION_REQUEST,
    } = AuthTypes;

    const { authUrls, storageKey, userField } = Object.assign(
      {
        authFields: { username: "username", password: "password" },
        storageKey: "token",
        userField: "user",
      },
      options
    );

    switch (type) {
      case AUTH_LOGIN_REQUEST:
        return new Promise((resolve, reject) => {
          const method = "get";
          const url = authUrls.login;

          client({ url, method, withCredentials: true })
            .then((response) => {
              const { data } = response;
              const { [storageKey]: token, [userField]: id } = data;

              client.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${token}`;

              sessionStorage.setItem(storageKey, token);
              sessionStorage.setItem(userField, JSON.stringify({ id }));
              resolve({ id });
            })
            .catch((error) => {
              location.assign("/login.html");
              reject(error);
            });
        });

      case AUTH_CHECK_REQUEST:
        return new Promise((resolve, reject) => {
          const token = sessionStorage.getItem(storageKey);
          const user = JSON.parse(sessionStorage.getItem(userField));
          const method = "get";

          if (token) {
            client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const url = `${authUrls.userInfo}/${user.id}`;

            client({ url, method })
              .then((response) => {
                const userInfo = response.data || {};
                resolve(userInfo);
              })
              .catch((error) => reject(error));
          } else {
            reject();
          }
        });

      case AUTH_GET_OPERATION_REQUEST:
        return new Promise((resolve, reject) => {
          const method = "get";
          const url = authUrls.operations;

          return client({ url, method })
            .then((response) => {
              const operations = response.data || {};
              resolve(operations);
            })
            .catch((error) => {
              reject(error);
            });
        });

      default:
        return Promise.resolve();
    }
  };
};
