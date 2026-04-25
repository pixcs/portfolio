import EditInfoForm from "@/app/components/form/editInfoForm/EditInfoForm";
import { getSession } from "@/app/lib/action";
import { redirect } from "next/navigation";
import type { ClientSession } from "@/app/models/models";

const EditInfoPage = async () => {
    const session = (await getSession()) as ClientSession;

    if (!session?.isLoggedIn || !session?.isAdmin) {
        redirect("/");
    }

    if (!session.userId) {
        redirect("/");
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/login/${session.userId}`,
        { cache: "no-store" }
    );

    const { admin }: { admin: UserInfo } = await res.json();

    return (
        <div>
        <EditInfoForm session={session} info={admin.info} />
        </div>
    );
};

export default EditInfoPage;