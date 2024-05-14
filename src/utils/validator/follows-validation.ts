import * as Joi from "joi";

export const FollowValidation = Joi.object({
  following: Joi.number().allow(null),
  follower: Joi.number().allow(null),
});
