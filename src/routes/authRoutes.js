import express from "express";
import passport from "passport";

const router = express.Router();


// Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("http://localhost:5173/dashboard");
    }
);

// Logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) console.error(err);
        res.redirect("http://localhost:5173/");
    });
});

// Get Current User
router.get("/user", (req, res) => {
    res.send(req.user);
});

export default router;