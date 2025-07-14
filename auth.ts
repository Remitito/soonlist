import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import clientPromise from "./lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [Google],
});
