import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./src/app/_lib/dbMongoDb";
import { verifyPassword } from "./src/app/_lib/auth";

console.log("Model imported in [...nextauth].js!");


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const client = await clientPromise;
        const db = client.db();
        // Query the database using the native MongoDB client
        const user = await db.collection("users").findOne({ email: credentials.email });
        console.log("User found: ", user);

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
        return {
          id: user._id.toString(), // MongoDB uses ObjectId, so convert it to string
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Ensure JWT strategy is enabled
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string || "";
        session.user.email = token.email as string || "";
        session.user.name = token.name as string || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      // Include user information in JWT token
      if (user) {
        const customUser = user as { id: string; email: string; firstName: string; lastName: string };
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = `${customUser.firstName} ${customUser.lastName}`;
      }
      return token;
    },
  },
});
