/**
 * Application routes enum for type safety
 *
 * This enum defines all available routes in the application.
 * Routes are organized by feature and provide compile-time safety.
 */
export enum Routes {
  // Public pages
  HOME = "/",
  ABOUT = "/about",
  CONTACT = "/contact",
  EVENTS = "/events",
  BOOK = "/book",
  TERMS = "/terms",

  // Auth pages
  AUTH_LOGIN = "/auth/login",
  AUTH_REGISTER = "/auth/register",
  AUTH_CALLBACK = "/auth/callback",

  // User pages
  PROFILE = "/profile",
}
