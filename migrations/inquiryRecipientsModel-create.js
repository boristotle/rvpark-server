module.exports = {
    up: async function (queryInterface, Sequelize) {
      return queryInterface.createTable('InquiryRecipients',
        {
          UserId: {
            type: Sequelize.UUID
          },
          InquiryCommentId: {
            type: Sequelize.INTEGER
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          }
        }
    )},
  down: async function (queryInterface, Sequelize) {
      return queryInterface.dropTable('InquiryRecipients')
    }
  };