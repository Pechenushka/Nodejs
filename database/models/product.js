module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        imagePath: DataTypes.STRING,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.DOUBLE,

    }, {});
    Product.associate = function(models) {
        // associations can be defined here
    };
    return Product;
};