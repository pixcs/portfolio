
import { Dispatch, SetStateAction, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { SiContentstack } from "react-icons/si";

type Props = {
    message: GetInTouch,
    setListOfMessage: Dispatch<SetStateAction<GetInTouch[]>>,
    setReRender: Dispatch<SetStateAction<boolean>>
}

const MessageList = ({
    message,
    setListOfMessage,
    setReRender
}: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteMessageInbox = async (id: string): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/get-in-touch/${id}`, {
                cache: "no-store",
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const { messages, success }: { messages: GetInTouch[], success: string } = await res.json();

            if (!res.ok) {
                throw new Error("Error: failed to delete message inbox");
            }
            //console.log("result:", success, "messages:", messages);
            setListOfMessage(messages);
            setReRender(true);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        } finally {
            setIsLoading(false);
            setReRender(false);
        }
    }

    return (
        <div
            key={message._id}
            className=" my-3 p-3 flex flex-col gap-4 border border-gray-200 dark:border-slate-600 backdrop-blur-sm relative"
        >
            <div>
                <div className="flex items-center justify-between">
                    <h3 className=" font-medium text-sm">{message.name}</h3>
                    <IoTrashBinOutline
                        size={30}
                        className="p-2 hovered text-red-500"
                        onClick={() => deleteMessageInbox(message._id)}
                    />
                </div>
                <p className="text-sm dark:text-gray-300">{message.email}</p>
            </div>
            <div className="flex items-center justify-between">
                <h3 className="text-sm dark:text-gray-300 font-medium">{message.subject}</h3>
                <p className="text-sm dark:text-gray-300">{message.createdAt.slice(0, 10)}</p>
            </div>
            <p className="dark:text-gray-300 text-sm">
                {message.message}
            </p>

            {isLoading && (
                <div className="absolute -top-0 -bottom-0 left-0 right-0 bg-gray-200/80 dark:bg-slate-700/80 backdrop-blur animate-pulse">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-3">
                        <SiContentstack size={30} className="rotate-effect" />
                        <p className="text-sm">Deleting...</p>
                    </div>
                </div>
            )}


        </div>
    )
}

export default MessageList;