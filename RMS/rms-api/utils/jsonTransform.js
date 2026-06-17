function applyJsonTransform(schema) {
  schema.set("toJSON", {
    virtuals: true,
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      if (ret.password) delete ret.password;
      return ret;
    },
  });
}

module.exports = { applyJsonTransform };
