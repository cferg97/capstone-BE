import cardModel from "../search/model.js";
import express from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const cardRouter = express.Router();

cardRouter.get("/:cardName", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const sets = [];
    const imageUris = [];
    const card = await cardModel
      .find({ name: { $regex: `${req.params.cardName}`, $options: "i" } })
      .select(
        "name lang image_uris mana_cost type_line foil nonfoil set_name rarity oracle_text cardmarket_id colors"
      );

    card.forEach((i) => {
      sets.push(i.set_name);
      imageUris.push(i.image_uris);
    });

    const cardName = card[0].name;
    const type = card[0].type_line;
    const rarity = card[0].rarity;
    const text = card[0].oracle_text;
    const color = card[0].colors;

    const combined = imageUris.map(function (obj, index) {
      let myobj = {};
      myobj[sets[index]] = obj;
      return myobj;
    });

    const toSend = {
      cardInfo: {
        name: cardName,
        type: type,
        rarity: rarity,
        text: text,
        color: color,
      },
      images: combined,
    };

    res.send(toSend);
  } catch (err) {
    next(err);
  }
});

export default cardRouter;
