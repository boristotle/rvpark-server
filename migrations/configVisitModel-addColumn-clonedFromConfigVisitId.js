const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("ConfigVisits")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromConfigVisitId) return Promise.resolve();
        return queryInterface.addColumn("ConfigVisits", "clonedFromConfigVisitId", {
            type: Sequelize.INTEGER,
            references: {
              model: "ConfigVisits",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("ConfigVisits", "clonedFromConfigVisitId");
    }
};