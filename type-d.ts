interface SessionData {
    userId?: string;
    username?: string;
    img?: string,
    isAdmin?: boolean;
    isLoggedIn: boolean;
}

type Admin = {
    _id: string,
    username: string,
    password: string,
    isAdmin: boolean,
    createdAt: string,
    updatedAt: string,
    __v: boolean
}

type FormExperience = {
    companyName: string
    companyLogo: string
    companyUrl: string
    position: string
    tasks: string
    range: string
}

type ListOfExperience = {
    list_of_experience: WorkExperience[]
}

type WorkExperience = {
    _id: string,
    companyName: string,
    companyLogo: string,
    companyUrl: string,
    position: string,
    tasks: string[],
    range: string,
    __v: boolean
}

type FormProject = {
    projectName: string,
    projectImage: string,
    projectUrl: string,
    description: string,
    toolsAndTechInput: string
}

type Project = {
    _id: string,
    projectName: string;
    projectImage: string;
    projectUrl: string;
    description: string;
    toolsAndTech: string[];
}

type ContactForm = {
    name: string,
    email: string,
    subject: string,
    message: string
}

type GetInTouch = {
    _id: string,
    name: string,
    email: string,
    subject: string,
    message: string,
    createdAt: string
}



