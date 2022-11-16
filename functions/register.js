const { createDbUser } = require("../lib/db");
const mysql = require("../db/mysql");
const moment = require('moment');
const luhn = require("luhn");
var validator = require("email-validator");

let yearcurrent = moment().year();
let yearend =yearcurrent+5;

module.exports.handler = async function registerUser(event) {
  const body = JSON.parse(event.body);
  let response = {};
  const errors = [];
  console.log("parameter :", body);
  let card = luhn.validate(body.card_number);
  let validemail = validator.validate(body.email);

  if (!card){
    if (body.card_number.length<13 || body.card_number.length>16){
        errors.push({ NumberCreditCard: "Number Credit Card is Incorrect" });
    } 
    errors.push({ NumberCreditCard: "Credit Card is Incorrect" });
  }
  if (body.cvv.length<3 || body.cvv.length>4){
      errors.push({ NumberCreditCard: "Number CVV is Incorrect" });
  }
  if ((body.expiration_month.length<1 && body.expiration_month.length>2) || (body.expiration_month<1 && body.expiration_month>12) ){
      errors.push({ Expiration_month: "Expiration_month is Incorrect" });
  }
  if ((body.expiration_year.length!=4) || (body.expiration_year<yearcurrent || body.expiration_year>yearend) ){
      errors.push({ Expiration_month: "Expiration_year is Incorrect" });
  }
  if ((body.email.length<5 && body.email.length>100) || (!validemail) ){
      errors.push({ Expiration_month: "Email is Incorrect" });
  }
  if (Object.keys(errors).length) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      data: "",
      message: "Failed Datos Clients",
      errors: errors,
    });
    return response;
  }
  else {
  const createTokens = await mysql.insert(process.env.TBL_TOKEN, body);
  console.log('mysql :', createTokens)
  return createDbUser(body)
    .then(user => ({
      statusCode: 200,
      body: JSON.stringify(user)
    }))
    .catch(err => {
      console.log({ err });

      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: { stack: err.stack, message: err.message }
      };
    });
  }
};
