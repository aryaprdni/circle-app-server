import * as Joi from "joi";

const createValidation = Joi.object({
    content : Joi.string().required(),
    image : Joi.string().allow(null),
    created_at : Joi.date(),
    updated_at : Joi.date()
})

const updateValidation = Joi.object({
    content : Joi.string().required(),
    image : Joi.string().allow(null),
    created_at : Joi.date(),
    updated_at : Joi.date()
})

export {
    createValidation,
    updateValidation
}