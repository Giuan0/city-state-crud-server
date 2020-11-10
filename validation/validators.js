const {
    celebrate,
    Joi,
    Segments
} = require('celebrate');

exports.statePostValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        abbreviation: Joi.string().required()
    })
});

exports.cityPostValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        state: Joi.string().required()
    })
});