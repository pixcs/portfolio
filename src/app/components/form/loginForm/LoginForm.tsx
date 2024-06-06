"use client";

import { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation'

type ErrorResponse = { error: string };

function isErrorResponse(data: any): data is ErrorResponse {
  return (data as ErrorResponse).error !== undefined;
}

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {        
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
            const data: Admin | ErrorResponse = await res.json();
            
            if(!res.ok) {
                if (isErrorResponse(data)) {
                    console.error("Error:", data.error);
                    setError(data.error);
                } 
                return
            }
            
            //console.log(data);
            router.push("/");
            router.refresh();

        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleLogin}
            className="flex flex-col justify-center gap-5 max-w-80 md:max-w-2xl mx-auto bg-gray-100 dark:bg-slate-900 p-7 my-10 shadow-xl rounded-xl"
        >
            <label htmlFor="username" className="dark:text-gray-300 font-medium">Username</label>
            <input
                type="text"
                name="username"
                id="username"
                required
                placeholder="Username"
                className=" dark:text-gray-400 dark:bg-slate-950 p-4 border-2 border-gray-400 rounded-lg outline-none"
                onChange={e => setUsername(e.target.value)}
            />
            <label htmlFor="password" className="dark:text-gray-300 font-medium">Password</label>
            <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Password"
                className=" dark:text-gray-400 dark:bg-slate-950 p-4 border-2 border-gray-400 rounded-lg outline-none"
                onChange={e => setPassword(e.target.value)}
            />
            {error && (<p className="text-red-600">{error}</p>)}
            <button 
               className="font-semibold my-4 py-2 border-2 text-white bg-slate-900 dark:bg-white border-gray-400 rounded-xl dark:text-black hover:bg-black dark:hover:bg-gray-300 transition duration-300"
               disabled={loading}
            >
                {loading ? "Processing..." : "Login"}
            </button>
        </form>
    )
}

export default LoginForm;