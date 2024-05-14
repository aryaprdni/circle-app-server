import * as express from "express";
import UserControllers from "../controllers/user-controllers";
import authMiddleware from "../middlewares/auth-middleware";
import uploadFile from "../middlewares/UploadFile";
import threadsControllers from "../controllers/threads-controllers";
import repliesControllers from "../controllers/replies-controllers";
import likesControllers from "../controllers/likes-controllers";
import followsControllers from "../controllers/follows-controllers";

const router = express.Router();

// User
router.post("/user/register", UserControllers.Register);
router.patch("/user/edit-profile", authMiddleware.Auth, uploadFile().multipleUploadMiddleware, UserControllers.Update);
router.post("/user/login", UserControllers.login);
router.get("/users", authMiddleware.Auth, UserControllers.getAll);
// router.get("/user/:id", authMiddleware.Auth, UserControllers.getOne);
router.get("/user/check", authMiddleware.Auth, UserControllers.check);
// router.patch("/user/edit-background", authMiddleware.Auth, uploadFile("profile_description"), UserControllers.updateBackground);

// Threads
router.post("/threads", authMiddleware.Auth, uploadFile().singleUploadMiddleware, threadsControllers.create);
router.patch("/threads/:id", authMiddleware.Auth, uploadFile().singleUploadMiddleware, threadsControllers.update);
router.delete("/threads/:id", authMiddleware.Auth, threadsControllers.delete);
router.get("/threads", authMiddleware.Auth, threadsControllers.getAll);
router.get("/threads/:id", authMiddleware.Auth, threadsControllers.getById);

// Replies
router.post("/replies", authMiddleware.Auth, uploadFile().singleUploadMiddleware, repliesControllers.create);
router.patch("/replies/:id", authMiddleware.Auth, uploadFile().singleUploadMiddleware, repliesControllers.update);
router.delete("/replies/:id", authMiddleware.Auth, repliesControllers.delete);
router.get("/replies", authMiddleware.Auth, repliesControllers.getAll);
router.get("/replies/:id", authMiddleware.Auth, repliesControllers.getById);

// Likes
router.post("/like", authMiddleware.Auth, likesControllers.create);
router.delete("/like/:threadId", authMiddleware.Auth, likesControllers.delete);
router.get("/like", authMiddleware.Auth, likesControllers.getAll);
router.get("/like/:id", authMiddleware.Auth, likesControllers.getById);

// Follows
router.post("/follow", authMiddleware.Auth, followsControllers.create);
router.get("/follow", authMiddleware.Auth, followsControllers.find);
router.delete("/follow/:followerUserId", authMiddleware.Auth, followsControllers.delete);
// router.get("/follows/:id", authMiddleware.Auth, followsControllers.getById);

// // NOTIFICATION SSE
// router.get("/notification", (req: express.Request, res: express.Response) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   res.write("event: message\n");
//   function sendNotification(data: any) {
//     res.write("data: " + JSON.stringify(data) + "\n\n");
//   }

//   router.get("/new-thread", (req, res) => {
//     const thread = JSON.stringify({ data: "New Thread!" });
//     sendNotification(thread);

//     res.sendStatus(200);
//   });
// });

export default router;
