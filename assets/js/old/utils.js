function configureProperties(entity, properties) {
  for (const key in properties) {
    entity.setAttribute(key, properties[key])
  }
  return entity
}