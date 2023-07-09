import Joi from 'joi';

export const itemSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    title: Joi.string().trim().min(1).label('Title').required(),
    description: Joi.string().label('Description').trim().max(500).required(),
  });
