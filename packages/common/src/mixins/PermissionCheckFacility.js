export default {
  methods: {
    permissionFacility(app, facilityData, userInfo) {
      let data = facilityData;
      let dataCountry = [];
      let dataSite = [];
      let canAccessAll = false;

      if (userInfo && userInfo.roles && userInfo.roles.length > 0) {
        let entityRoles = userInfo.roles.filter(
          (role) => role.app === app && role.isActive
        );

        let entityCountry = [];
        let entitySite = [];

        entityRoles.forEach((role) => {
          if (role.entityLevel === "Company" || role.entityLevel === "Region")
            canAccessAll = true;
          if (role.entityLevel === "Country") entityCountry.push(role);
          if (role.entityLevel === "Site") entitySite.push(role);
        });

        if (!canAccessAll) {
          if (entityCountry.length > 0) {
            dataCountry = data.filter(
              (item) =>
                entityRoles.filter((role) => {
                  if (role.entityLevel === "Country") {
                    let countryLevel = item.entityLevelName;
                    let countryCode = countryLevel
                      .substr(-countryLevel.length, countryLevel.indexOf("-"))
                      .trim()
                      .toLowerCase();
                    return role.entityParent === countryCode;
                  }
                }).length > 0
            );
          }

          if (entitySite.length > 0) {
            dataSite = data.filter(
              (item) =>
                entityRoles.filter(
                  (role) =>
                    role.entityLevel === "Site" &&
                    role.entityParent === item.entityLevelCode
                ).length > 0
            );
          }

          data = [...dataCountry, ...dataSite];
        }
      }

      return data;
    },
  },
};
