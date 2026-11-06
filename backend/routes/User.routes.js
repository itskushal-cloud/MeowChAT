import express from "express";
import protectroute from "../middleware/protectroute.js";
import {
    searchUsers, getUserById, getFriends, sendRequest, getRequests,
    acceptRequest, rejectRequest, cancelRequest, removeFriend,
} from "../controllers/User.controller.js";

const router = express.Router();
router.use(protectroute); // every route below needs login

router.get("/search", searchUsers);              // GET  /api/users/search?q=lisa
router.get("/friends", getFriends);              // GET  /api/users/friends
router.get("/requests", getRequests);            // GET  /api/users/requests
router.post("/request/:id", sendRequest);        // POST /api/users/request/:id
router.put("/request/:id/accept", acceptRequest);
router.put("/request/:id/reject", rejectRequest);
router.delete("/request/:id", cancelRequest);    // cancel one I sent
router.delete("/friends/:id", removeFriend);
router.get("/:id", getUserById);                 // keep LAST so it doesn't swallow the others

export default router;