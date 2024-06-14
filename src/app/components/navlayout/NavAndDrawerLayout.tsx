"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Drawer from "@/app/components/drawer/Drawer";
import { IronSession } from "iron-session";
import { info } from "console";

type Props = {
    session: IronSession<SessionData> | undefined
}

const NavAndDrawerLayout = ({ session }: Props) => {
    const [darkMode, setDarkMode] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    const [listOfMessage, setListOfMessage] = useState<GetInTouch[]>([]);
    const [reRender, setReRender] = useState(false);
    const [showInbox, setShowInbox] = useState(false);
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        const theme = localStorage.getItem("theme");

        if (theme === "dark")  { 
            setDarkMode(true);
        }

        const getResumeUrl = async () => {
            const alternative = session?.userId ? session?.userId : "666b094dab43a459a391d327";
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login/${alternative}`, { cache: "no-store" });
            const { admin: { info } }: { admin: UserInfo } = await res.json();
            setResumeUrl(info.resumeUrl);
        }
        getResumeUrl();
    }, [])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }

    }, [darkMode])

    useEffect(() => {
        if (showDrawer) {
            document.body.classList.add("hide-scroll");
        } else {
            document.body.classList.remove("hide-scroll");
        }
    }, [showDrawer])

    const getAllMessages = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/get-in-touch`, { cache: "no-store" })
            const { messages }: { messages: GetInTouch[] } = await res.json();
            if (!res.ok) {
                throw new Error("Error: failed to fetch messages");
            }
            setListOfMessage(messages);
            //console.log("result messages:", messages);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    }

    useEffect(() => {
        if (session?.isLoggedIn && session?.isAdmin) {
            getAllMessages();
        }
    }, [reRender, showInbox, showDrawer])

    return (
        <>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                session={session}
                listOfMessage={listOfMessage}
                setListOfMessage={setListOfMessage}
                setReRender={setReRender}
                showInbox={showInbox}
                setShowInbox={setShowInbox}
                resumeUrl={resumeUrl}
            />
            <Drawer
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                session={session}
                listOfMessage={listOfMessage}
                setListOfMessage={setListOfMessage}
                setReRender={setReRender}
                resumeUrl={resumeUrl}
            />
        </>
    )
}

export default NavAndDrawerLayout;