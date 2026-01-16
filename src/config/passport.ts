import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
import dotenv from "dotenv";

dotenv.config();

console.log("process.env.FACEBOOK_APP_ID:", process.env.FACEBOOK_APP_ID);
console.log("process.env.FACEBOOK_APP_SECRET:", process.env.FACEBOOK_APP_SECRET);

passport.use(new FacebookStrategy({

    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'] 
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(new Error("Facebook account must have an email associated."));
      }

      let user = await User.findOne({ email });

      if (!user) {
        // Sign Up logic
        user = await User.create({
          name: profile.displayName,
          email: email,
          credits: 5,
          // Generate a random password since it's required in the schema
          password: Math.random().toString(36).slice(-8) 
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});