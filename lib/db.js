// Require AWS SDK and instantiate DocumentClient
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { Model } = require("dynamodb-toolbox");
const { v4: uuidv4 } = require("uuid");

const User = new Model("User", {
  // Specify table name
  table: "table-tokens",
  // Define partition and sort keys
  partitionKey: "pk",
  sortKey: "sk",

  // Define schema
  schema: {
    pk: { type: "string", alias: "email" },
    sk: { type: "string", alias: "card_number" },
    cvv: { type: "string" },
    expiration_year: { type: "string" },
    expiration_month: { type: "string" },
    id: { type: "string" },
    tokenu: { type: "string" },
    createdAt: { type: "string" }
  }

});

// INIT AWS
AWS.config.update({
  region: "us-east-1"
});



const docClient = new AWS.DynamoDB.DocumentClient();

const createDbUser = async props => {
  const tokenu = await bcrypt.hash(props.card_number, 2); // hash the pass
  //delete props.password; // don't save it in clear text

  const params = User.put({
    ...props,
    id: uuidv4(),
    tokenu,
    createdAt: new Date()
  });

  console.log("create user with params", params);

  const response = await docClient.put(params).promise();

  return User.parse(response);
};

const getUserByEmail = async email => {
  const params = User.get({ email, sk: "User" });
  const response = await docClient.get(params).promise();

  return User.parse(response);
};

module.exports = {
  createDbUser,
  getUserByEmail
};
