module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      validate: {
          notEmpty: {
          msg: "* Must have a username"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "* Enter a password"
        }
      }
    }
  });
  return User;
};