declare module "*.css";

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
    userId?: string
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
    userId?: string,
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

type AdminInfo = {
    _id?: string;
    userId?: string;
    title?: string;
    name?: string;
    about?: string;
    address?: string;
    colorStatus?: string;
    status?: string;
    githubUrl?: string;
    facebookUrl?: string;
    linkedUrl?: string;     
    profileUrl?: string;
    resumeUrl?: string;
    email?: string;
    contactNumber?: string;
    metadata?: {            
        title?: string;
        description?: string;
        icons?: string;
    };
    createdAt?: string;
    updatedAt?: string;
};

type UserInfo = {
    _id: string
}

type AboutMeInfo = {
  heading?: string;
  paragraphs?: string[];
  quickFacts?: string[];
  profileImages?: string[];
};



