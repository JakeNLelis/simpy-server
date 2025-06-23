const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
} = require("../controllers/userControllers");
const router = require("express").Router();

// User Routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", getUser);
router.get("/users", getUsers);
router.patch("/users/:id", editUser);
router.get("/users/:id/follow-unfollow", followUnfollowUser);
router.post("/users/avatar", changeUserAvatar);

module.exports = router;
