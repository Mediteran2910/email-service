const Joi = require("joi");

function createSchema(fields) {
  const schemaFields = {
    name: Joi.string().min(2).required().messages({
      "string.base": '"name" should be a type of "text"',
      "string.empty": '"name" cannot be an empty field',
      "any.required": '"name" is a required field',
    }),
    email: Joi.string().email().required().messages({
      "string.base": '"email" should be a type of "text"',
      "string.email": '"email" must be a valid email',
      "any.required": '"email" is a required field',
    }),
    message: Joi.string().min(10).required().messages({
      "string.base": '"message" should be a type of "text"',
      "string.empty": '"message" cannot be an empty field',
      "string.min": '"message" should have at least 10 characters',
      "any.required": '"message" is a required field',
    }),
  };

  if (fields.surname) {
    schemaFields.surname = Joi.string().min(2).required().messages({
      "string.base": '"surname" should be a type of "text"',
      "string.empty": '"surname" cannot be an empty field',
      "any.required": '"surname" is a required field',
    });
  }

  if (fields.phone) {
    schemaFields.phone = Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        "string.base": '"phone" should be a valid phone number',
        "string.pattern.base": '"phone" should be a valid phone number format',
      });
  }

  if (fields.address) {
    schemaFields.address = Joi.string().min(5).optional().messages({
      "string.base": '"address" should be a type of "text"',
      "string.empty": '"address" cannot be an empty field',
      "any.required": '"address" is a required field',
    });
  }

  return Joi.object(schemaFields).unknown(true);
}

module.exports = { createSchema };
