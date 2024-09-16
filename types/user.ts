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
