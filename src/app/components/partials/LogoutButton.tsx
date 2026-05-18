"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
    const router = useRouter();
    const [status, setStatus] = useState("");

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        setStatus("You've been logged out.");
        setTimeout(() => {
            setStatus("");
            router.push("/");
            router.refresh();
        }, 1500);
    };

    return (
        <>
            {/* Toast */}
             <p className={`${
                status ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
            } fixed top-5 right-8 origin-top-right p-4 text-sm font-medium text-white dark:text-black bg-slate-950 dark:bg-white shadow-xl rounded-md z-[9999] transition-all duration-200`}>
                {status}
            </p>

            <button
                onClick={handleLogout}
                className="px-2 py-1 hovered active:scale-95"
            >
                Logout
            </button>
        </>
    );
};

export default LogoutButton;