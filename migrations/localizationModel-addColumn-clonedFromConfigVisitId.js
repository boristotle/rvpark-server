const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Localizations")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromConfigVisitId) return Promise.resolve();
        return queryInterface.addColumn("Localizations", "clonedFromConfigVisitId", {
            type: Sequelize.INTEGER,
            references: {
              model: "ConfigVisits",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Localizations", "clonedFromConfigVisitId");
    }
};