'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"Spots",
          key:"id"
        },
        onDelete:"CASCADE"
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        //unique:true,
        references:{
          model:"Users",
          key:"id"
        },
        onDelete:"CASCADE"
      },
      review: {
        type: Sequelize.TEXT
      },
      stars: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      }
    },options);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reviews', options);
  }
};