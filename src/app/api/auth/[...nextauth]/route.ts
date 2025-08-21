import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const cookieStore = cookies();
      const mode = (await cookieStore).get("mode")?.value;

      if (mode && mode == "login") {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/loginGoogle`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          }
        );
        const status = await resp.status;
        const data = await resp.json();

        if (status == 200) {
          const token = sign(
            {
              email: user.email,
              idUser: data.idUser,
              rol: "customer",
            },
            "123abc",
            {
              expiresIn: "3d",
            }
          );

          // Establecer cookie
          (await cookieStore).set("token", token, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/",
          });

          return true;
        } else {
          throw new Error(data?.message);
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user!.email = token.email;
        session.user!.name = token.name;
        session.user!.image = token.picture;
      }
      return session;
    },

    redirect({ url, baseUrl }) {
      return `${baseUrl}/index`;
    },
  },
  pages: {
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
