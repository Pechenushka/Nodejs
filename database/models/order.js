const uuidv4 = require('uuid/v4');

module.exports  = (sequelize, DataTypes) => {
    const Order= sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            primaryKey: true
        },
        user: {
            type: DataTypes.UUID,
            allowNull: false
        },

        cart: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        hooks: {

        },

    });
    Order.associate = function(models) {
        // associations can be defined here
    };

    return Order;
};



