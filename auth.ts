import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { dbConnect}  from "./src/app/_lib/db";
import User from "./src/app/_models/User";
import { verifyPassword } from "./src/app/_lib/auth";

console.log("Model imported in [...nextauth].js!");

let client;

async function getClient() {
  if (!client) {
    client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return client;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(getClient),
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
        const user = await User.findOne({ email: credentials.email }).exec();

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
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string || "";
        session.user.email = token.email as string || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      // Include user information in JWT token
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
  },
});
