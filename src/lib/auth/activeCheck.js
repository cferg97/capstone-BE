import createHttpError from "http-errors";

export const activeCheckMiddleware = (req, res, next) => {
  if (req.user.active === true) {
    next();
  } else {
    next(
      createHttpError(
        403,
        "Active your account before carrying out this operation"
      )
    );
  }
};
