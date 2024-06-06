import { SessionOptions } from "iron-session";


export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_COOKIES_PASS as string,
    cookieName: "admin-session",
    cookieOptions: {
        httpOnly: true,                                   // prevent client javascript for cookie so only server side
        secure: process.env.NODE_ENV === "production"    // set to true to work only in production else in development
    }
}



