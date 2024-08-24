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

interface ClassResponse extends Class {
    id: string;
    userId: string;
}
