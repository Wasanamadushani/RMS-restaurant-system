const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const {
  createFood,
  getFoods,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

router.post(
  "/",
  upload.single("image"), // middleware
  createFood              // controller function
);

router.put(
  "/:id",
  upload.single("image"),
  updateFood
);

router.get("/", getFoods);
router.delete("/:id", deleteFood);

module.exports = router;