import mongoose, { Schema, Types } from "mongoose";

export type ClientSession = {
    isLoggedIn: boolean;
    userId?: string;
    username?: string;
    isAdmin: boolean;
};

type AdminSchema = {
    username: string;
    password: string;
    isAdmin: boolean;
};

export type AdminInfoSchema = {
    userId: Types.ObjectId;
    name: string;
    about: string;
    address: string;
    colorStatus: string;
    status: string;
    githubUrl: string;
    facebookUrl: string;
    profileUrl: string;
    resumeUrl: string;
};

export type AboutContentSchema = {
    userId: Types.ObjectId;
    heading: string;
    paragraphs: string[];
    quickFacts: string[];
    profileImages: string[];
    profileImagePathnames: string[]
};

export type WorkExpSchema = {
    userId: Types.ObjectId;
    companyName: string;
    companyLogo: string;
    companyUrl: string;
    position: string;
    tasks: string[];
    range: string;
};

export type ProjectSchema = {
    userId: Types.ObjectId;
    projectName: string;
    projectImage: string;
    projectUrl: string;
    description: string;
    toolsAndTech: string[];
};

const adminSchema = new Schema<AdminSchema>(
    {
        username: { type: String, required: true, unique: true, min: 3, max: 20 },
        password: { type: String, required: true, min: 8, max: 20 },
        isAdmin:  { type: Boolean, default: true },
    },
    { timestamps: true }
);

const adminProfileSchema = new Schema<AdminInfoSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            unique: true,
        },
        name:        { type: String },
        about:       { type: String },
        address:     { type: String },
        colorStatus: { type: String },
        status:      { type: String },
        githubUrl:   { type: String },
        facebookUrl: { type: String },
        profileUrl:  { type: String },
        resumeUrl:   { type: String },
    },
    { timestamps: true }
);

const aboutContentSchema = new Schema<AboutContentSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            unique: true,
        },
        heading: {
            type: String,
            required: true,
            default: "A little bit about me:",
        },
        paragraphs: {
            type: [String],
            required: true,
            default: [],
        },
        quickFacts: {
            type: [String],
            required: true,
            default: [],
        },
        profileImages: {
            type: [String],
            required: true,
            default: [],
        },
        profileImagePathnames: {
            type: [String],
            required: true
        }
    },
    { timestamps: true }
);

const workExperience = new Schema<WorkExpSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
        companyName: { type: String, required: true },
        companyLogo: { type: String },
        companyUrl:  { type: String },
        position:    { type: String, required: true },
        tasks:       { type: [String], required: true },
        range:       { type: String, required: true },
    },
    { timestamps: true }
);

const projectSchema = new Schema<ProjectSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
        projectName:  { type: String, required: true },
        projectImage: { type: String, required: true },
        projectUrl:   { type: String, required: true },
        description:  { type: String, required: true },
        toolsAndTech: { type: [String], required: true },
    },
    { timestamps: true }
);

const getInTouch = new Schema(
    {
        name:    { type: String },
        email:   { type: String },
        subject: { type: String },
        message: { type: String },
    },
    { timestamps: true }
);




// Single index definitions — no duplicates
aboutContentSchema.index({ userId: 1 });
workExperience.index({ userId: 1 });
projectSchema.index({ userId: 1 });




export const AdminModel      = mongoose.models.Admin      || mongoose.model("Admin", adminSchema);
export const AdminInfoModel  = mongoose.models.AdminInfo  || mongoose.model("AdminInfo", adminProfileSchema);
export const GetInTouchModel = mongoose.models.GetInTouch || mongoose.model("GetInTouch", getInTouch);

//  Delete cache so schema changes always take effect in dev hot reload
delete (mongoose.models as Record<string, unknown>).AboutMe;
export const AboutMeModel = mongoose.model<AboutContentSchema>("AboutMe", aboutContentSchema);

delete (mongoose.models as Record<string, unknown>).WorkExp;
export const WorkExperience = mongoose.model<WorkExpSchema>("WorkExp", workExperience);

delete (mongoose.models as Record<string, unknown>).Project;
export const ProjectModel = mongoose.model<ProjectSchema>("Project", projectSchema);
