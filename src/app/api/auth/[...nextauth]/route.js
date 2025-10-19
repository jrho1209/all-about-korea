import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./lib/mongodb"; // MongoDB 연결 유틸
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("manual_users");
        const user = await users.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'user',
          agencyId: user.agencyId,
        };
      },
    }),
  ],
  // adapter: MongoDBAdapter(clientPromise), // 임시 비활성화
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1시간 (초 단위)
    updateAge: 60 * 5, // 5분마다 갱신 (구독 정보 업데이트를 위해 단축)
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.agencyId = user.agencyId;
        // 구글 로그인시 프로필 이미지 저장
        if (account?.provider === "google") {
          token.picture = user.image;
        }
      }
      
      // 매번 JWT 토큰 갱신시 최신 구독 정보 가져오기
      if (token.email) {
        try {
          const client = await clientPromise;
          const db = client.db('allaboutkorea');
          const users = db.collection("users");
          const userDoc = await users.findOne({ email: token.email });
          if (userDoc?.subscription) {
            token.subscription = userDoc.subscription;
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.agencyId = token.agencyId;
      
      // 구독 정보를 세션에 추가
      if (token.subscription) {
        session.user.subscription = token.subscription;
        session.user.plan = token.subscription.plan;
        session.user.status = token.subscription.status;
        session.user.currentPeriodEnd = token.subscription.currentPeriodEnd;
        session.user.stripeSubscriptionId = token.subscription.stripeSubscriptionId;
      }
      
      // 세션에 프로필 이미지 추가
      session.user.image = token.picture || session.user.image;
      
      console.log('Session callback - user:', session.user); // 디버깅
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };