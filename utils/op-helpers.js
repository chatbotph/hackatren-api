module.exports.isNotExists = toCheck =>
  toCheck === null || toCheck === undefined;

module.exports.populateQuery = (populate = "") => {
  if (populate.length > 0) {
    const qParams = populate.split(" ");
    return qParams.map(params => {
      const [path, select] = params.split(";");
      return {
        path,
        select: select.replace(",", " ")
      };
    });
  } else {
    return [];
  }
};
