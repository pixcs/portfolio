"use client";

import { useState, useEffect, Fragment } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Drawer from "@/app/components/drawer/Drawer";
import { IronSession } from "iron-session";

type Props = {
    session:  IronSession<SessionData> | undefined
}

const NavAndDrawerLayout = ({ session }: Props) => {
    const [darkMode, setDarkMode] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    const [listOfMessage, setListOfMessage] = useState<GetInTouch[]>([]);
    const [reRender, setReRender] = useState(false);
    const [showInbox, setShowInbox] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") setDarkMode(true);
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
        <Fragment>
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
            />
        </Fragment>
    )
}

export default NavAndDrawerLayout;