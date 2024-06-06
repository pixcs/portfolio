import mongoose, { Schema } from "mongoose";

type AdminSchema = {
    username: string,
    password: string,
    isAdmin: boolean
}

type WorkExpSchema = {
    companyName: string,
    companyLogo: string,
    companyUrl: string,
    position: string,
    tasks: string[],
    range: string
}

type ProjectSchema = {
    projectName: string,
    projectImage: string,
    projectUrl: string,
    description: string,
    toolsAndTech: string[]
}

const adminSchema = new Schema<AdminSchema>({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        min: 8,
        max: 20
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const workExperience = new Schema<WorkExpSchema>({
    companyName: {
        type: String,
        required: true
    },
    companyLogo: {
        type: String
    },
    companyUrl: {
        type: String
    },
    position: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        required: true
    },
    range: {
        type: String,
        required: true
    }
}, { timestamps: true })

const projectSchema = new Schema<ProjectSchema>({
    projectName: {
        type: String,
        required: true,
    },
    projectImage: {
        type: String,
        required: true
    },
    projectUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    toolsAndTech: {
        type: [String],
        required: true
    },

}, { timestamps: true })

const getInTouch = new Schema<GetInTouch>({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    subject: {
        type: String
    },
    message: {
        type: String
    }
}, { timestamps: true })

export const AdminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export const WorkExperience = mongoose.models.WorkExp || mongoose.model("WorkExp", workExperience);
export const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);
export const GetInTouchModel = mongoose.models.GetInTouch || mongoose.model("GetInTouch", getInTouch);