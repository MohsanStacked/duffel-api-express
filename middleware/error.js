const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default errorHandler;
