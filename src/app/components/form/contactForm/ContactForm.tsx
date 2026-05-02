"use client";

import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useState
} from "react";

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
            // First request: save message
            const contactRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/get-in-touch`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ name, email, subject, message }),
                }
            );

            const contactData = await contactRes.json();

            if (!contactRes.ok) {
                throw new Error(contactData.error || "Failed to save message");
            }

            // Second request: send email
            const emailRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URI}/api/send-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message,
                    }),
                }
            );

            const emailData = await emailRes.json();

            if (!emailRes.ok) {
                throw new Error(emailData.error || "Failed to send email");
            }

            setStatus("Message sent successfully!");

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (err) {
            if (err instanceof Error) {
                setStatus(err.message);
                console.error(err.message);
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(""), 2000);
        }
    };

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
                className="py-4 pl-2 rounded outline-none text-slate-700 dark:text-white border-b border-gray-400 bg-transparent"
                onChange={handleChange}
                value={name}
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="py-4 pl-2 rounded outline-none text-slate-700 dark:text-white border-b border-gray-400 bg-transparent"
                onChange={handleChange}
                value={email}
            />
            <input
                type="text"
                placeholder="Subject"
                name="subject"
                required
                className="py-4 pl-2 rounded outline-none text-slate-700 dark:text-white border-b border-gray-400 bg-transparent"
                onChange={handleChange}
                value={subject}
            />
            <textarea
                name="message"
                placeholder="Message"
                required
                className="py-4 pl-2 rounded w-full outline-none text-slate-700 dark:text-white border-b border-gray-400 max-h-36 md:min-h-52 bg-transparent"
                onChange={handleChange}
                value={message}
            />
            <button
                className="relative mt-1 w-full py-3 rounded-lg text-sm font-semibold tracking-wide overflow-hidden
                    bg-gradient-to-b from-slate-800 to-slate-900 dark:from-white dark:to-gray-200
                    text-white dark:text-black border border-slate-700/50
                    hover:from-slate-700 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-gray-300
                    disabled:opacity-60 disabled:cursor-not-allowed
                    shadow-md shadow-slate-900/20
                    transition duration-300"
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin" />
                        Processing...
                    </span>
                ) : (
                    "Send message"
                )}
            </button>
        </form>
    )
}

export default ContactForm;