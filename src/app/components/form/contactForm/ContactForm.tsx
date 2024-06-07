"use client";

import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    status: string,
    setStatus: Dispatch<SetStateAction<string>>
}

const ContactForm = ({ status, setStatus }: Props) => {
    const [formData, setFormData] = useState<ContactForm>({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const { name, email, subject, message } = formData;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const { name, value } = e.currentTarget;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/get-in-touch`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ name, email, subject, message })
            })
            const data: { success: string } | { error: string } = await res.json();

            if (!res.ok) {
                throw new Error("Error: failed to insert new message");
            }

            if (data) {
                if ('success' in data) {
                    setStatus(data.success);
                } else if ('error' in data) {
                    setStatus(data.error);
                }
            }

            console.log("result:", data);
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            })
            router.refresh();

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(""), 2000);
        }
    }

    return (
        <form
            className="flex-1 flex flex-col gap-y-5 w-full relative"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl md:text-3xl text-left font-medium">Send me a message</h2>
            <input
                type="text"
                placeholder="Name"
                name="name"
                required
                className="py-4 rounded outline-none text-slate-700 dark:text-white border-b border-gray-400 bg-transparent"
                onChange={handleChange}
                value={name}
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="py-4 rounded outline-none text-slate-700 dark:text-white border-b border-gray-400 bg-transparent"
                onChange={handleChange}
                value={email}
            />
            <input
                type="text"
                placeholder="Subject"
                name="subject"
                required
                className="py-4 rounded outline-none text-slate-700 dark:text-white border-b border-gray-400 bg-transparent"
                onChange={handleChange}
                value={subject}
            />
            <textarea
                name="message"
                placeholder="Message"
                required
                className="py-4 rounded w-full outline-none text-slate-700 dark:text-white border-b border-gray-400 max-h-36 md:min-h-52 bg-transparent"
                onChange={handleChange}
                value={message}
            />
            <button 
               className="scale-90 py-4 text-white font-semibold dark:text-black bg-slate-900 dark:bg-white dark:hover:bg-gray-200 rounded-lg w-44 hover:bg-black hover:scale-95 duration-300 mb-5 md:mb-0"
               disabled={isLoading}
            >
                {isLoading ? "Processing..." : "Send message"}
            </button>
        </form>
    )
}

export default ContactForm;