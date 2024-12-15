import colors from "colors";
const logger = (req, res, next) => {
  const methodColors = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    DELETE: colors.red,
  };
  console.log(
    methodColors[req.method](
      `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
    )
  );
  next();
};

export default logger;
