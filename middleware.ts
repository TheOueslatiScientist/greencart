import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/connexion",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/compte/:path*",
    "/commandes/:path*",
    "/checkout/:path*",
  ],
};
