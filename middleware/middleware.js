const { ResponseTemplate } = require("../helper/template.helper");
const Joi = require("joi").extend(require("@joi/date"));

function CheckPostUser(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().alphanum().max(255).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().alphanum().required(),
    identity_type: Joi.string().valid("KTP", "SIM", "BPJS").required(),
    identity_number: Joi.number().integer().required(),
    address: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) {
    let respErr = ResponseTemplate(
      null,
      "invalid request",
      error.details[0].message,
      400,
    );
    res.json(respErr);
    return;
  }

  next();
}

function CheckPostTodos(req, res, next) {
  const schema = Joi.object({
    task: Joi.string()
      .regex(/^[a-zA-Z0-9, ]*$/, "Alphanumerics, space and comma characters")
      .max(255)
      .required(),
    description: Joi.string()
      .regex(/^[a-zA-Z0-9, ]*$/, "Alphanumerics, space and comma characters")
      .max(255)
      .required(),
    userId: Joi.number(),
    start: Joi.date().utc(),
    finish: Joi.date().utc(),
    status: Joi.string().alphanum().max(255).required(),
  });

  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) {
    let respErr = ResponseTemplate(
      null,
      "invalid request",
      error.details[0].message,
      400,
    );
    res.json(respErr);
    return;
  }

  next();
}

function CheckPostTransaction(req, res, next) {
  const schema = Joi.object({
    source_account_id: Joi.number().required(),
    destination_account_id: Joi.number().required(),
    amount: Joi.number().required(),
    type: Joi.string().valid("Deposit", "Withdraw", "Transfer").required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = ResponseTemplate(
      null,
      "invalid request",
      error.details[0].message,
      400,
    );
    res.json(respErr);
    return;
  }

  next();
}

function CheckPostDeposit(req, res, next) {
  const schema = Joi.object({
    source_account_id: Joi.number().required(),
    destination_account_id: Joi.number().required(),
    amount: Joi.number().required(),
    type: Joi.string().valid("Deposit", "Withdraw", "Transfer").required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = ResponseTemplate(
      null,
      "invalid request",
      error.details[0].message,
      400,
    );
    res.json(respErr);
    return;
  }

  next();
}

module.exports = {
  CheckPostUser,
  CheckPostTodos,
  CheckPostTransaction,
  CheckPostDeposit,
};
