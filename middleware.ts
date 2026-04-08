export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/compte/:path*",
    "/commandes/:path*",
    "/checkout/:path*",
    "/panier/:path*",
  ],
};
