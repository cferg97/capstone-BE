import createHttpError from "http-errors";

export const activeCheckMiddleware = (req, res, next) => {
  if (req.user.active === true) {
    next();
  } else {
    next(
      createHttpError(
        403,
        "Activate your account before carrying out this operation"
      )
    );
  }
};
0