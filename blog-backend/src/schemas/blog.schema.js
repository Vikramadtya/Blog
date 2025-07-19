import Joi from 'joi';

export const blogSchema = Joi.object({
  id: Joi.string().uuid().required(),
  publish: Joi.boolean().required(),
  blogNumber: Joi.number().required(),
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  previewImageSrc: Joi.string().allow('').required(),
  // The author is now validated as an object
  author: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().allow(''),
    avatar: Joi.string().allow(''),
  }).required(),
  summary: Joi.string().required(),
  slug: Joi.string().required(),
  type: Joi.string().valid('blog', 'snippet').required(),
  demo: Joi.object({
    live: Joi.boolean(),
    preview: Joi.string().allow(null),
    repository: Joi.string().allow(null),
  }).required(),
  readingTime: Joi.string(),
  toc: Joi.array().items(
    Joi.object({
      level: Joi.number(),
      title: Joi.string(),
    }),
  ),
});
