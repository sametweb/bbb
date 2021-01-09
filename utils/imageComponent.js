const extractName = require("./extractName");

module.exports = function (file, size) {
  return `<div class="image">
    <img class="product-with-view" src="${file}" 
      width="${size.width}" 
      height="${size.height}" 
      alt="${extractName(file)}" 
    />
  </div>`;
};
