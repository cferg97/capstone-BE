import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provided a bearer token"));
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");

      const payload = await verifyAccessToken(accessToken);
      req.user = {
        _id: payload._id,
        username: payload.username,
        active: payload.active,
      };
      next();
    } catch (err) {
      console.log(err);
      next(
        createHttpError(401, "Token not valid. Please check your bearer token.")
      );
    }
  }
};
