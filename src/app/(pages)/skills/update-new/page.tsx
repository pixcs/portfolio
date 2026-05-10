import SkillsForm from "@/app/components/form/skillsForm/SkillsForm";
import { getSession } from "@/app/lib/action";
import { redirect } from "next/navigation";
import type { ClientSession, SkillItem } from "@/app/models/models";

type SkillsResponse = {
    enabledSkills: SkillItem[];
};

const EditSkillsPage = async () => {
    const session = (await getSession()) as ClientSession;

    if (!session?.isLoggedIn || !session?.isAdmin) redirect("/");
    if (!session.userId) redirect("/");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/skills/${session.userId}`,
        { cache: "no-store" }
    );

    const data: SkillsResponse = res.ok
        ? await res.json()
        : { enabledSkills: [] };

    return (
        <div>
            <SkillsForm userId={session.userId} initialSkills={data.enabledSkills} />
        </div>
    );
};

export default EditSkillsPage;