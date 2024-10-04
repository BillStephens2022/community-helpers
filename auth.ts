import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { dbConnect}  from "./src/app/_lib/db";
import User from "./src/app/_models/User";
import { verifyPassword } from "./src/app/_lib/auth";

console.log("Model imported in [...nextauth].js!");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(dbConnect()),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {

        // logic to verify if the user exists
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found!");    
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
