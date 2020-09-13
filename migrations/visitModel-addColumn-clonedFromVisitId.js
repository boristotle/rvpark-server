const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Visits")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromVisitId) return Promise.resolve();
        return queryInterface.addColumn("Visits", "clonedFromVisitId", {
            type: Sequelize.INTEGER,
            references: {
              model: "Visits",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Visits", "clonedFromVisitId");
    }
};