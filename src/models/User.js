import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        // OAuth provider-specific fields
        oauthProvider: {
            type: String,
            enum: ['google', 'facebook', 'github'],  // You can add more providers
            required: true,
        },
        oauthId: {
            type: String,
            required: true,
            unique: true, // Ensure unique ID for the provider (e.g., googleId, githubId)
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure unique email
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        avatar: {
            type: String,  // URL of the user's avatar image
        },
        accessToken: {
            type: String,  // OAuth access token (for making API requests)
        },
        refreshToken: {
            type: String,  // OAuth refresh token (if available)
        },
        // Optional: If you plan to store user roles (e.g., 'admin', 'user', etc.)
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;