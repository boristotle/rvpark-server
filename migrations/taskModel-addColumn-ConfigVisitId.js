const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Tasks")
      .then(tableDefinition => {
        if (tableDefinition.ConfigVisitId) return Promise.resolve();
        return queryInterface.addColumn("Tasks", "ConfigVisitId", {
            type: Sequelize.INTEGER,
            references: {
              model: "ConfigVisits",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Tasks", "ConfigVisitId");
    }
};