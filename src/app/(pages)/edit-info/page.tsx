"use server";

import EditInfoForm from "@/app/components/form/editInfoForm/EditInfoForm";
import { getSession } from "@/app/lib/action";
import { redirect } from "next/navigation";

const EditInfoPage = async () => {
    const session = await getSession();
    console.log("Edit info Page SESSION ID:", session?.userId);
    
    if (!session?.isLoggedIn && !session?.isAdmin) {
        redirect("/");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login/${session?.userId}`, { cache: "no-store" });
    const { admin: { info } }: { admin: UserInfo } = await res.json();
    console.log("Edit:", info);

    return (
        <div>
            <EditInfoForm
                session={session}
                info={info}
            />
        </div>
    )
}

export default EditInfoPage;