import express from "express";
import createHttpError from "http-errors";
import usersModel from "./model.js";
import Token from "./tokenSchema.js";
import { createAccessToken } from "../../lib/auth/tools.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { activeCheckMiddleware } from "../../lib/auth/activeCheck.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

const usersRouter = express.Router();

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await usersModel.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404));
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await usersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.status(201).send();
    } else {
      next(createHttpError(404, `User with id ${req.user._id} not found.`));
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new usersModel(req.body);
    const { _id, email } = await newUser.save();
    let token = new Token({
      _userId: _id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();

    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          api_key: process.env.SG_API,
        },
      })
    );
    const mailOptions = {
      from: "c.ferguson1997@gmail.com",
      to: email,
      subject: "Account Verification Link",
      text:
        "Hello " +
        req.body.firstName +
        ",\n\n" +
        "This email was sent on behalf of MTG Marketplace. Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/users" +
        "/confirmation/" +
        email +
        "/" +
        token.token +
        "\n\nThank You!\n",
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        next(createHttpError(500, "There was an issue on our end!"));
      }
      res.send("A verification email has been sent to your email inbox.");
    });
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/confirmation/:email/:token", async (req, res, next) => {
  try {
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token) {
        next(
          createHttpError(
            400,
            "Your verification link may have expired. Please click on resend."
          )
        );
      } else {
        usersModel.findOne(
          { _id: token._userId, email: req.params.email },
          function (err, user) {
            if (!user) {
              next(createHttpError(401, "Cannot find a matching user."));
            } else if (user.active) {
              res
                .status(200)
                .send("User has already been verified. Please log in!");
            } else {
              user.active = true;
              user.save();
              res.send(
                "Your account has been successfully verified. Please log in!"
              );
            }
          }
        );
      }
    });
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await usersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, email: user.email };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(404, "Please check your credentials!"));
    }
  } catch (err) {
    next(err);
  }
});
export default usersRouter;
