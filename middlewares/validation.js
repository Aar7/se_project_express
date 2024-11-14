const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const mongoIdRegex = /[a-f0-9]{24}/;

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
module.exports.validateItemInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
      "string.empty": 'The "imageUrl" field must be filled in',
    }),
  }),
});

module.exports.validateNewUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
      "string.empty": 'The "imageUrl" field must be filled in',
    }),
    email: Joi.string().required().custom(validator.isEmail()).messages({
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must me filled in',
    }),
  }),
});

module.exports.validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
      "string.empty": 'The "imageUrl" field must be filled in',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom(validator.isEmail()).messages({
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must me filled in',
    }),
  }),
});

module.exports.validateDocumentId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().regex(mongoIdRegex),
  }),
});
