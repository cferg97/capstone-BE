import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cardSchema = new Schema(
  {
    object: { type: String },
    id: { type: String },
    oracle_id: { type: String },
    multiverse_ids: { type: Array },
    mtgo_id: { type: Number },
    mtgo_foil_id: { type: Number },
    tcgplayer_id: { type: Number },
    cardmarket_id: { type: Number },
    name: { type: String },
    lang: { type: String },
    released_at: { type: String },
    uri: { type: String },
    scryfall_uri: { type: String },
    layout: { type: String },
    highres_image: { type: Boolean },
    image_status: { type: String },
    image_uris: { type: Object },
    mana_cost: { type: String },
    cmc: { type: Number },
    type_line: { type: String },
    oracle_text: { type: String },
    power: { type: String },
    toughness: { type: String },
    colors: { type: Array },
    color_identity: { type: Array },
    keywords: { type: Array },
    legalities: { type: Object },
    games: { type: Array },
    reserved: { type: Boolean },
    foil: { type: Boolean },
    nonfoil: { type: Boolean },
    finishes: { type: Array },
    oversized: { type: Boolean },
    promo: { type: Boolean },
    reprint: { type: Boolean },
    variation: { type: Boolean },
    set_id: { type: String },
    set: { type: String },
    set_name: { type: String },
    set_type: { type: String },
    set_uri: { type: String },
    set_search_uri: { type: String },
    scryfall_search_uri: { type: String },
    rulings_uri: { type: String },
    prints_search_uri: { type: String },
    collector_number: { type: String },
    digital: { type: Boolean },
    rarity: { type: String },
    flavor_text: { type: String },
    card_back_id: { type: String },
    artist: { type: String },
    artist_ids: { type: Array },
    illustration_id: { type: String },
    border_color: { type: String },
    frame: { type: String },
    full_art: { type: Boolean },
    textless: { type: Boolean },
    booster: { type: Boolean },
    story_spotlight: { type: Boolean },
    edhrec_rank: { type: Number },
    penny_rank: { type: Number },
    prices: { type: Object },
    related_uris: { type: Object },
  },
  { timestamps: false }
);

cardSchema.static("pagination", async function (query) {
  const total = await this.countDocuments(query.criteria);

  const products = await this.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    .select("name set_name image_uris rarity collector_number prices cardmarket_id");

  return { total, products };
});

export default model("cardInfo", cardSchema);
