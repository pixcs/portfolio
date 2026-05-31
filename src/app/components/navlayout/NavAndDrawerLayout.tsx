"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Drawer from "@/app/components/drawer/Drawer";
import { IronSession } from "iron-session";

type Props = {
    session: IronSession<SessionData> | undefined,
    profileUserId: string,
    title: string
}

const NavAndDrawerLayout = ({ session, profileUserId, title }: Props) => {
    const [darkMode, setDarkMode] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [listOfMessage, setListOfMessage] = useState<GetInTouch[]>([]);
    const [reRender, setReRender] = useState<boolean>(false);
    const [showInbox, setShowInbox] = useState<boolean>(false);
    const [resumeUrl, setResumeUrl] = useState<string>("");
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const STORAGE_KEY = `lastSeenMessageCount_${profileUserId}`;

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") setDarkMode(true);

        const getResumeUrl = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/admin-info/${profileUserId}`,
                { cache: "no-store" }
            );
            const data = await res.json();
            if (res.ok && data.info) setResumeUrl(data.info.resumeUrl);
        };
        getResumeUrl();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    useEffect(() => {
        if (showDrawer) {
            document.body.classList.add("hide-scroll");
        } else {
            document.body.classList.remove("hide-scroll");
        }
    }, [showDrawer]);

    const getAllMessages = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/get-in-touch?userId=${profileUserId}`,
                { cache: "no-store" }
            );
            const { messages }: { messages: GetInTouch[] } = await res.json();
            if (!res.ok) throw new Error("Error: failed to fetch messages");

            setListOfMessage(messages);

            // Calculate unread count from localStorage
            const lastSeen = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
            const unread = messages.length - lastSeen;
            setUnreadCount(unread > 0 ? unread : 0);

        } catch (err) {
            if (err instanceof Error) console.error(err.message);
        }
    };

    // Initial load + polling every 30 seconds
    useEffect(() => {
        if (session?.isLoggedIn && session?.isAdmin && session?.userId === profileUserId) {
            getAllMessages();
            const interval = setInterval(getAllMessages, 30000);
            return () => clearInterval(interval);
        }
    }, [reRender]);

    // Listen for new message sent from ContactForm instantly
    useEffect(() => {
        const handleNewMessage = () => {
            if (session?.isLoggedIn && session?.isAdmin && session?.userId === profileUserId) {
                getAllMessages();
            }
        };

        window.addEventListener("newMessageSent", handleNewMessage);
        return () => window.removeEventListener("newMessageSent", handleNewMessage);
    }, [session, profileUserId]);

    // Clear badge and save current count to localStorage when inbox is opened
    useEffect(() => {
        if (showInbox) {
            setUnreadCount(0);
            localStorage.setItem(STORAGE_KEY, String(listOfMessage.length));
        }
    }, [showInbox]);

    return (
        <>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                session={session}
                profileUserId={profileUserId}
                listOfMessage={listOfMessage}
                setListOfMessage={setListOfMessage}
                setReRender={setReRender}
                showInbox={showInbox}
                setShowInbox={setShowInbox}
                resumeUrl={resumeUrl}
                title={title}
                unreadCount={unreadCount}
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
                title={title}
            />
        </>
    );
};

export default NavAndDrawerLayout;