const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Localizations")
      .then(tableDefinition => {
        if (tableDefinition.ConfigSiteId) return Promise.resolve();
        return queryInterface.addColumn("Localizations", "ConfigSiteId", {
            type: Sequelize.INTEGER,
            references: {
              model: "ConfigSites",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Localizations", "ConfigSiteId");
    }
};