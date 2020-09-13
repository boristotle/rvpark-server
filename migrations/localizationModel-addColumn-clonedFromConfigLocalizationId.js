const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Localizations")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromConfigLocalizationId) return Promise.resolve();
        return queryInterface.addColumn("Localizations", "clonedFromConfigLocalizationId", {
            type: Sequelize.INTEGER,
            references: {
              model: "ConfigLocalizations",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Localizations", "clonedFromConfigLocalizationId");
    }
};