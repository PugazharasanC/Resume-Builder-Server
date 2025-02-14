import express, { json } from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from './src/models/User.js';
import connectDb from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5500;

// Ensure FRONTEND_URL is defined
if (!process.env.FRONTEND_URL) {
    console.error('FRONTEND_URL is not defined in .env file!');
    process.exit(1);
} else {
    console.log(process.env.FRONTEND_URL)
}

// Middleware to handle JSON requests
app.use(json());

// Enable CORS with frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL,  // Ensure this is correctly set in your .env file
    credentials: true,  // Allow cookies (authentication tokens) to be sent
}));

// Connect to the database
connectDb();

// Session middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use custom authentication routes
app.use('/auth', authRoutes);

// Google OAuth Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5500/auth/google/callback', // Must match your Google Developer Console settings
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ oauthId: profile.id });

            if (!user) {
                user = new User({
                    oauthProvider: 'google',
                    oauthId: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    avatar: profile.photos ? profile.photos[0].value : null,
                    accessToken,
                    refreshToken,
                });

                await user.save();
            }

            return done(null, user); // Send user to session
        } catch (error) {
            return done(error, null);
        }
    }));

// Serialize user to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example API route
app.get('/api', (req, res) => {
    res.json({ message: 'This is an API endpoint!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
