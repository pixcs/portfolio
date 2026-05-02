import EditAboutMeForm from "@/app/components/form/aboutMeForm/EditAboutMeForm";
import { getSession } from "@/app/lib/action";
import { redirect } from "next/navigation";
import type { ClientSession } from "@/app/models/models";

const EditAboutMePage = async () => {
    const session = (await getSession()) as ClientSession;

    if (!session?.isLoggedIn || !session?.isAdmin) {
        redirect("/");
    }

    if (!session.userId) {
        redirect("/");
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/about/${session.userId}`,
        { cache: "no-store" }
    );

    // 404 just means no doc yet — pass empty info so the form starts blank
    const data = res.ok ? await res.json() : {};
    const about = data?.about ?? null;

    return (
        <div>
            <EditAboutMeForm session={session} info={about} />
        </div>
    );
};

export default EditAboutMePage;
