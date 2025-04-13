// User types
export interface UserTypes {
    id: string;
    name: string;
    email: string;
    image: string;
    isApproved: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export type UserState = {
    user: UserTypes;
    isAdmin: boolean;
    isLoading: boolean;
}

// Resource types
export interface DocumentTypes {
    id: string;
    documentName: string;
    documentDesc: string;
    type: string;
    size: string;
    link: string;
    unitId: string;
    creatorId: string;
    creator?: UserTypes;
    createdAt: Date | null;
}

export interface UnitTypes {
    id: string;
    unitName: string;
    unitDesc: string;
    subjectId: string;
    documents?: DocumentTypes[];
    creatorId: string;
    creator?: UserTypes;
    createdAt: Date | null;
}
export interface SubjectTypes {
    id: string;
    subjectName: string;
    subjectDesc: string;
    courseId: string;
    units?: UnitTypes[];
    creatorId: string;
    creator?: UserTypes;
    createdAt: Date | null;
}
export interface CourseTypes {
    id: string;
    courseName: string;
    courseDesc: string;
    instituteId: string;
    subjects?: SubjectTypes[];
    creatorId: string;
    creator?: UserTypes;
    createdAt: Date | null;
}

export interface InstitutionTypes {
    id: string;
    instituteName: string;
    description: string;
    courses?: CourseTypes[];
    creatorId: string;
    creator?: UserTypes;
    createdAt: Date | null;
}