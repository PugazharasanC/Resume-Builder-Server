// app.js
import express, { json } from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from './src/models/User.js';
import connectDb from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 5500;

// Middleware to handle JSON requests
app.use(json());
app.use(cors());

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

// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5500/auth/google/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ oauthId: profile.id });

      if (!user) {
        // If the user does not exist, create a new one
        user = new User({
          oauthProvider: 'google',
          oauthId: profile.id,
          email: profile.emails[0].value,  // Google provides an array of emails
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos ? profile.photos[0].value : null, // Avatar URL
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        // Save the new user to the database
        await user.save();
      }

      return done(null, user);  // Pass the user object to the session
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);  // Store the user ID in the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});



// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example API route
app.get('/api', (req, res) => {
    res.json({ message: 'This is an API endpoint!' });
});

// custom routes
app.use('/auth', authRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
