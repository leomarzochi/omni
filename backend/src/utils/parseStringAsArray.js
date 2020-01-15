module.exports = function parseStringAsArray(data) {
  return data.split(',').map(tech => tech.trim());
};
