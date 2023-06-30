import Joi from 'joi';


export const userSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().trim().min(1).label('Name').required(),
    email: Joi.string()
      .label('Email')
      .trim()
      .required()
      .regex(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  });