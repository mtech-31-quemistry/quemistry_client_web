interface UserProfile {
    email: string;
    roles: string[];
}

interface Class {
    code: string;
    description: string;
    educationLevel: string;
    subject: string;
    classInvitations?: ClassInvitation[];
    tutorEmails: String[];
    startDate?: Date;
    endDate?: Date;
    status: string;
}

interface Student {
    firstName: string;
    lastName: string;
    educationLevel: string;
    email: string;
    registeredClasses: Class[];
}

interface ClassResponse extends Class {
    id: number;
    userId: string | null;
    tutors: Tutor[];
}

interface ClassInvitation {
    id: number;
    userEmail: string;
    code: string;
    userType: number;
    status: string;
    firstName?: string;
    lastName?: string;
}

interface StudentInvitation {
    invitationCode: string;
}

interface StudentInvitationResponse {
    success: boolean;
}

interface InviteStudent {
    studentEmail: string;
    studentFullName: string;
    classCode: string;
}

interface InputClass {
    name: string;
    code: string;
}

interface UserServiceResponseDto {
    statusCode: string;
    statusMessage: string;
    serviceName: string;
    errors: ErrorDto[];
    payload: any;
}

interface ErrorDto {
    code: string;
    displayMessage: string;
}

interface Tutor {
    firstName: string;
    lastName: string;
    email: string;
    educationLevel: string;
    tuitionCentre: string;
}
