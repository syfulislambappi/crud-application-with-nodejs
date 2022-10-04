// Dependencies
const router = require("express").Router();
const {
  getAllUsers,
  getRandomUser,
  saveUser,
  updateSingleUser,
  updateMultipleUsers,
  deleteUser,
} = require("../controllers/userControllers");

// Get all users
router.get("/all", getAllUsers);

// Get random users
router.get("/random", getRandomUser);

// Save user
router.post("/save", saveUser);

// Update single user
router.patch("/update/:id", updateSingleUser);

// Update multiple user
router.patch("/bulk-update", updateMultipleUsers);

// Delete user
router.delete("/delete/:id", deleteUser);

// Export router
module.exports = router;
