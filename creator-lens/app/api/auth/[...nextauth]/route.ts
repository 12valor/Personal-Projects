import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Imports from the clean file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };