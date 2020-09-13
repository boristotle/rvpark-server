const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    return queryInterface.describeTable("Subjects")
      .then(tableDefinition => {
        if (tableDefinition.clonedFromSubjectId) return Promise.resolve();
        return queryInterface.addColumn("Subjects", "clonedFromSubjectId", {
            type: Sequelize.INTEGER,
            references: {
              model: "Subjects",
              key: "id"
            }
        })
      })
    },
  down: async (queryInterface, sequelize) => {
    return queryInterface.removeColumn("Subjects", "clonedFromSubjectId");
    }
};