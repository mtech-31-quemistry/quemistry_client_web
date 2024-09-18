interface UserProfile {
    email: string;
    roles: string[];
}

interface Class {
    code: string;
    description: string;
    educationLevel: string;
    subject: string;
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
    educationLevel: string;
    tuitionCenter: string;
}

