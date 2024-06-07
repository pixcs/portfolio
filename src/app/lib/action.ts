import { getIronSession } from "iron-session";
import { sessionOptions } from "./lib"
import { cookies } from "next/headers"; //this one is sensitive all of the codes here should be in server side
import { revalidatePath } from "next/cache";

export const getSession = async () => {
   "use server";
   try {
      const session = await getIronSession<SessionData>(cookies(), sessionOptions);

      if (!session.isLoggedIn) {
         session.isLoggedIn = defaultSession.isLoggedIn;
      }

      return session;
   } catch (err) {
      if (err instanceof Error) {
         console.error(err);
      }
   }
}

export const defaultSession: SessionData = {
   isLoggedIn: false
}

export const logout = async () => {
   "use server";

   const session = await getSession();
   session?.destroy();
   revalidatePath("/");
}

