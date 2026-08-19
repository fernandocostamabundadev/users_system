const joi = require("joi");

const commentValidationSchema = joi.object({
  content: joi.string().required(),
  taskId: joi.string().required(),
  userId: joi.string().required(),
});

module.exports = taskSchema;
