"use client";

import Link from "next/link";
import {
    Dispatch,
    SetStateAction
} from "react";
import {
    MdOutlineLightMode,
    MdOutlineDarkMode,
    MdOutlineAdminPanelSettings
} from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsFillBellFill } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { IronSession } from "iron-session";
import MessageList from "@/app/components/messageList/MessageList";

type Props = {
    darkMode: boolean,
    setDarkMode: Dispatch<SetStateAction<boolean>>,
    showDrawer: boolean,
    setShowDrawer: Dispatch<SetStateAction<boolean>>
    session: IronSession<SessionData> | undefined,
    listOfMessage: GetInTouch[],
    setListOfMessage: Dispatch<SetStateAction<GetInTouch[]>>,
    setReRender: Dispatch<SetStateAction<boolean>>,
    showInbox: boolean,
    setShowInbox: Dispatch<SetStateAction<boolean>>
}

const Navbar = ({
    darkMode,
    setDarkMode,
    showDrawer,
    setShowDrawer,
    session,
    listOfMessage,
    setListOfMessage,
    setReRender,
    showInbox,
    setShowInbox
}: Props) => {
    //console.log("list of message:", listOfMessage);

    return (
        <header>
            <nav className="fixed w-full top-0 flex justify-between items-center py-4 px-5 md:px-70 bg-white/60 dark:bg-slate-950/60 transition-theme background-blur z-20">
                <div className="flex items-center justify-between w-full md:max-w-7xl mx-auto">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        <Link href="">{"<PIC />"}</Link>
                    </h3>
                    <div className="hidden md:flex space-x-5 items-center">
                        <ul className="flex space-x-8">
                            <li className="text-slate-500 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer duration-200">
                                <Link href="#about">About</Link>
                            </li>
                            <li className="text-slate-500 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer duration-200">
                                <Link href="#project">Project</Link>
                            </li>
                            <li className="text-slate-500 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer duration-200">
                                <Link href="#contact">Contact</Link>
                            </li>
                        </ul>
                        <span>|</span>
                        {darkMode ?
                            <MdOutlineDarkMode
                                className="cursor-pointer rounded-md p-2 hover:bg-slate-700/90 transition duration-300"
                                size={35}
                                onClick={() => setDarkMode(!darkMode)}
                            />
                            : <MdOutlineLightMode
                                className="cursor-pointer rounded-md p-2 hover:bg-gray-200 transition duration-300"
                                size={35}
                                onClick={() => setDarkMode(!darkMode)}
                            />
                        }
                        <div className="relative">
                            {showInbox ? (
                                <BsFillBellFill
                                    className="cursor-pointer rounded-md p-2 hover:bg-gray-200 dark:hover:bg-slate-700/90 transition duration-300"
                                    size={35}
                                    onClick={() => setShowInbox(!showInbox)}
                                />
                            ) : (
                                <IoNotificationsOutline
                                    className="cursor-pointer rounded-md p-2 hover:bg-gray-200 dark:hover:bg-slate-700/90 transition duration-300"
                                    size={35}
                                    onClick={() => setShowInbox(!showInbox)}
                                />
                            )}
                            <div className={`absolute  ${session?.isLoggedIn && session?.isAdmin ? " -bottom-auto" : "-bottom-48"} right-1/4 max-h-96 overflow-y-auto min-w-96 bg-white/80 p-3 dark:bg-slate-900/80 border border-gray-300 dark:border-slate-700 rounded-lg transition-all duration-100
                            ${showInbox ? "visible opacity-100" : "invisible opacity-0"}`}>
                                <h1 className="font-medium text-gray-400 dark:text-white">Inbox</h1>
                                {session?.isLoggedIn && session?.isAdmin ? (
                                    <>
                                        {listOfMessage.length > 0 ? (
                                            listOfMessage.map((message) => (
                                                <MessageList
                                                    message={message}
                                                    setListOfMessage={setListOfMessage}
                                                    setReRender={setReRender}
                                                />
                                            ))
                                        ) : (
                                            <p className="font-medium p-5">You have not yet received any messages.</p>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-5 flex flex-col gap-y-4">
                                        <h1 className="font-medium">Apologies, the inboxes are only visible to the administrator.</h1>
                                        <Link href="login" className=" underline font-medium">
                                            <MdOutlineAdminPanelSettings size={30} className=" inline-block mr-4" />
                                            Login as administrator?
                                        </Link>
                                    </div>
                                )}


                            </div>
                        </div>
                        <button className="px-4 py-2 font-medium text-white bg-slate-900 rounded-xl hover:bg-gray-700 dark:hover:bg-slate-200 active:bg-slate-700 active:scale-95 dark:bg-white dark:text-slate-900 dark:active:bg-slate-200 transition-theme">
                            <Link href="" target="_blank">Download CV</Link>
                        </button>
                    </div>
                </div>
                <RxHamburgerMenu
                    className="block md:hidden hovered p-2"
                    size={37}
                    onClick={() => setShowDrawer(!showDrawer)}
                />
            </nav>
        </header >
    )
}

export default Navbar;