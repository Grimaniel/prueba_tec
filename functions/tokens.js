const { createDbTokens } = require("../lib/db");

module.exports.handler = async function registerTokens(event) {
  const body = JSON.parse(event.body);

  return createDbTokens(body)
    .then(tokens => ({
      statusCode: 200,
      body: JSON.stringify(tokens)
    }))
    .catch(err => {
      console.log({ err });

      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    });
};
