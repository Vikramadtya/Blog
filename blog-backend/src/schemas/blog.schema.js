import Joi from 'joi';

export const blogSchema = Joi.object({
  id: Joi.string().uuid().required(),
  publish: Joi.boolean().required(),
  blogNumber: Joi.number().required(),
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  previewImageSrc: Joi.string().allow('').required(),
  author: Joi.string().required(), // Author is stored as an ID string
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
  wordCount: Joi.number(),
  imageCount: Joi.number(),
  links: Joi.object({
    internal: Joi.array().items(Joi.string()),
    external: Joi.array().items(Joi.string()),
  }),
  code: Joi.object({
    count: Joi.number(),
    languages: Joi.array().items(Joi.string()),
  }),
  excerpt: Joi.string().allow(null),
  keywords: Joi.array().items(Joi.string()),
  createdAt: Joi.string().isoDate().required(),
  updatedAt: Joi.string().isoDate().required(),
});
