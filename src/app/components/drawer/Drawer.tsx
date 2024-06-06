"use client";

import { IronSession } from "iron-session";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { IoIosClose } from "react-icons/io";
import { MdOutlineLightMode, MdOutlineDarkMode, MdOutlineAdminPanelSettings } from "react-icons/md";
import MessageList from "../messageList/MessageList";


type Props = {
    darkMode: boolean,
    setDarkMode: Dispatch<SetStateAction<boolean>>,
    showDrawer: boolean,
    setShowDrawer: Dispatch<SetStateAction<boolean>>,
    session: IronSession<SessionData> | undefined,
    listOfMessage: GetInTouch[],
    setListOfMessage: Dispatch<SetStateAction<GetInTouch[]>>,
    setReRender: Dispatch<SetStateAction<boolean>>
}

const Drawer = ({
    darkMode,
    setDarkMode,
    showDrawer,
    setShowDrawer,
    session,
    listOfMessage,
    setListOfMessage,
    setReRender
}: Props) => {
    return (
        < div
            className={`fixed inset-0 w-full md:hidden z-30 ${showDrawer ? 'bg-gray-900/10 dark:bg-gray-300/10 backdrop-blur-sm' : 'pointer-events-none'} `}
            onClick={() => setShowDrawer(false)}
        >
            <div
                className={`absolute top-0 bottom-0 right-0 w-80 bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 ${showDrawer ? 'transform-none' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()} // Prevent click events from propagating to the overlay
            >
                <div className="flex justify-between items-center p-4 border-b-2 border-gray-100 dark:border-slate-800">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{"<PIC />"}</h3>
                    <IoIosClose
                        className="hovered p-1"
                        size={40}
                        onClick={() => setShowDrawer(!showDrawer)}
                    />
                </div>
                <ul className="flex flex-col gap-y-4 p-4 border-b-2 border-gray-100 dark:border-slate-800">
                    <li
                        className="text-slate-500 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer duration-200"
                        onClick={() => setShowDrawer(!showDrawer)}
                    >
                        <Link href="#about">About</Link>
                    </li>
                    <li
                        className="text-slate-500 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer duration-200"
                        onClick={() => setShowDrawer(!showDrawer)}
                    >
                        <Link href="#project">Project</Link>
                    </li>
                    <li
                        className="text-slate-500 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer duration-200"
                        onClick={() => setShowDrawer(!showDrawer)}
                    >
                        <Link href="#contact">Contact</Link>
                    </li>
                </ul>
                <div className="flex justify-between items-center px-4 py-2">
                    <p className="text-slate-500 dark:text-gray-300 font-medium">Switch Theme</p>
                    {darkMode ?
                        <MdOutlineDarkMode
                            className="rounded-md p-2 hovered"
                            size={35}
                            onClick={() => setDarkMode(!darkMode)}
                        />
                        : <MdOutlineLightMode
                            className="rounded-md p-2 hovered"
                            size={35}
                            onClick={() => setDarkMode(!darkMode)}
                        />
                    }
                </div>
                <div className="p-4">
                    <button className="w-full px-4 py-2 font-medium text-white bg-slate-900 rounded-xl hover:bg-gray-700 dark:hover:bg-slate-200 active:bg-slate-700 active:scale-95 dark:bg-white dark:text-slate-900 dark:active:bg-slate-200 transition-theme">
                        Download CV
                    </button>
                </div>
                <div className="flex flex-col gap-y-4 p-4 border-t-2 border-gray-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-gray-300 font-medium">Inbox</p>
                    <div className="overflow-y-auto h-96">
                        {session?.isLoggedIn && session.isAdmin ? (
                            <>
                                {listOfMessage.length > 0 ? (
                                    listOfMessage.map((message) => (
                                        <MessageList
                                            key={message._id}
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
                                <h1 className="font-medium text-slate-500 dark:text-gray-300">Apologies, the inboxes are only visible to the administrator.</h1>
                                <Link href="login" className=" underline font-medium">
                                    <MdOutlineAdminPanelSettings size={30} className=" inline-block mr-4" />
                                    Login as administrator?
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Drawer;