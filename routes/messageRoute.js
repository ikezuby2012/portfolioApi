const express = require("express");
const { getAllMessages,getMessage,sendMessage,deleteMessage} = require("../controllers/messageController")

const router = express.Router();

router.route("/")
    .get(getAllMessages).post(sendMessage);

router.route("/:id")
    .get(getMessage).delete(deleteMessage);


module.exports = router;