const express = require("express");
const router = express.Router();
const apiRouter = require("./API/api");
const authRouter = require("./public/auth");
const publicRouter = require("./public/public");
const { setLocals, notFound, errorHandling } = require("./midleware");

router.use(setLocals);
router.use("/api", apiRouter);
router.use("/auth", authRouter);
router.use("/", publicRouter);
router.use(notFound);
router.use(errorHandling);

module.exports = router;
