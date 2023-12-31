const {
  CreateTask,
  DeleteTask,
  UpdateTask,
  ListTaskByStatus,
  TaskStatusCount,
  SearchByKeyword,
} = require("../controller/TasksController");
const {
  register,
  login,
  ProfileUpdate,
  GetProfileDetails,
  MatchProfile,
  VerifyOTPCode,
  ResetPassword,
} = require("../controller/UserController");
const AuthVerification = require("../middleware/AuthVerification");

const router = require("express").Router();

router.post("/registration", register);
router.post("/login", login);
router.post("/ProfileUpdate", AuthVerification, ProfileUpdate);
router.get("/GetProfileDetails", AuthVerification, GetProfileDetails);

router.post("/CreateTask", AuthVerification, CreateTask);
router.get("/DeleteTask/:id", AuthVerification, DeleteTask);
router.get("/UpdateTask/:id/:status", AuthVerification, UpdateTask);
router.get("/ListTaskByStatus/:status", AuthVerification, ListTaskByStatus);
router.get("/TaskStatusCount", AuthVerification, TaskStatusCount);

router.get("/SearchTask/:keyword", AuthVerification, SearchByKeyword);

router.get("/MatchProfile/:email", MatchProfile);
router.get("/VerifyOTPCode/:email/:otp", VerifyOTPCode);
router.post("/ResetPassword", ResetPassword);
module.exports = router;
