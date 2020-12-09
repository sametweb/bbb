module.exports = extractName = (str) =>
  str
    .split(".")[0]
    .split("-")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");
