import * as Joi from "joi";

const registerValidation = Joi.object({
  full_name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateValidation = Joi.object({
  id: Joi.number().allow(null),
  username: Joi.string().max(100).allow(null),
  full_name: Joi.string().max(100).allow(null),
  bio: Joi.string().max(100).allow(null),
  profile_picture: Joi.string().allow(null),
  profile_description: Joi.string().allow(null),
});

const loginValidation = Joi.object({
  username: Joi.string().max(100).allow(null),
  password: Joi.string().max(100).required(),
});

const updateBackgroundValidation = Joi.object({
  id: Joi.number().required(),
  profile_description: Joi.string().allow(null),
});

export { updateValidation, loginValidation, registerValidation, updateBackgroundValidation };
