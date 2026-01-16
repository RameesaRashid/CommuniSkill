import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // ✅ FIX: Safe optional chaining + nullish coalescing
        const email = profile.emails?.[0]?.value ?? null;

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          credits: 5,
          password: Math.random().toString(36).slice(-8),
        });

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
