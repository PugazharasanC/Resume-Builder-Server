export const getUserDetails = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        // Attach user details to the request object
        req.userDetails = req.user;
        next();
    } else {
        // If not authenticated, return an error or redirect
        res.status(401).json({ message: "Unauthorized" });
    }
};