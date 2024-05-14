import * as Joi from "joi";

const createValidation = Joi.object({
    threads: Joi.number().required(),
    user: Joi.number().required(),
});

const deleteValidation = Joi.object({
    threads: Joi.number().required(),
    user: Joi.number().required(),
});

export {
    createValidation,
    deleteValidation
}