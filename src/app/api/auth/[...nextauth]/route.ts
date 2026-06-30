import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { getGoogleOAuthConfig } from "@/app/utils/googleAuth";
import { publicEnv } from "@/app/config/env";

if (process.env.NODE_ENV === "development") {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

const googleOAuth = getGoogleOAuthConfig();

const providers: NextAuthOptions["providers"] = [];

if (googleOAuth.enabled) {
  providers.push(
    GoogleProvider({
      clientId: googleOAuth.clientId,
      clientSecret: googleOAuth.clientSecret,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      authorization: {
        params: {
          prompt: "select_account consent",
        },
      },
    }),
  );
}

const handler = NextAuth({
  providers,

  callbacks: {
    async signIn({ user }) {
      const cookieStore = cookies();
      const mode = (await cookieStore).get("mode")?.value;

      if (mode !== "login") {
        return false;
      }

      const email = user.email?.trim();
      const name =
        user.name?.trim() ||
        email?.split("@")[0] ||
        "Usuario Google";

      if (!email) {
        throw new Error("Google no devolvió un correo electrónico válido.");
      }

      try {
        const resp = await fetch(`${publicEnv.apiUrl}/user/loginGoogle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        });

        const data = await resp.json().catch(() => ({}));

        if (resp.status !== 200) {
          throw new Error(
            data?.message ||
              data?.error ||
              `No se pudo iniciar sesión con Google (${resp.status}). Verifica que pcinbox-server esté corriendo en ${publicEnv.apiUrl}.`,
          );
        }

        const jwtSecret = publicEnv.keyJwt;
        if (!jwtSecret) {
          throw new Error(
            "Falta NEXT_PUBLIC_KEY_JWT en el cliente. Debe coincidir con KEY_JWT de pcinbox-server.",
          );
        }

        const isValidToken = verify(data.data.token, jwtSecret);

        (user as any).idUser = Number(data.data.idUser.toString());
        (user as any).token = data.data.token;
        (user as any).rol = "customer";
        (user as any).idValidToken = isValidToken;
        (user as any).active = data.data.active;
        (user as any).totalFavorites = data.data.totalFavorites;
        return true;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Error interno del servidor";
        console.error("[next-auth] loginGoogle:", message);
        throw new Error(message);
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.sub = token.sub;
        token.idUser = (user as any).idUser;
        token.rol = (user as any).rol;
        token.token = (user as any).token;
        token.isValidToken = (user as any).idValidToken;
        token.active = (user as any).active;
        token.totalFavorites = (user as any).totalFavorites;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user!.email = token.email;
        session.user!.name = token.name;
        session.user!.image = token.picture;
        (session as any).idUser = token.idUser;
        (session as any).rol = token.rol;
        (session as any).token = token.token;
        (session as any).isValidToken = token.isValidToken;
        (session as any).active = token.active;
        (session as any).totalFavorites = token.totalFavorites;
      }
      return session;
    },
  },

  pages: {
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  secret:
    publicEnv.nextAuthSecret ||
    (process.env.NODE_ENV === "development"
      ? "dev-pcinbox-nextauth-secret"
      : undefined),
});

export { handler as GET, handler as POST };
