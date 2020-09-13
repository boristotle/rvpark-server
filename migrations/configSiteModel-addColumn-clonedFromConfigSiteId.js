const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("ConfigSites")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromConfigSiteId) return Promise.resolve();
        return queryInterface.addColumn("ConfigSites", "clonedFromConfigSiteId", {
            type: Sequelize.INTEGER,
            references: {
              model: "ConfigSites",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("ConfigSites", "clonedFromConfigSiteId");
    }
};