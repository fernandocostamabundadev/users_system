const joi = require("joi");

const postValidationSchema = joi.object({
  title: joi.string().min(5).max(100).required(),
  content: joi.string().min(10).required(),
  authorId: joi.string().required(),
  userId: joi.string().required(),
});

module.exports = postValidationSchema;
