const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL}/retrieve`
const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/invitation/accept`

import api from "./ConnectionService"

export const UserService = {
  async addClass(data: Class) {
    const res = await fetch(classUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    console.log('res', res);
  },

  async getClasses() {
    return (await api<UserServiceResponse<ClassResponse[]>>(getAllClassesUrl)).payload;
  },

  async acceptInvitation(studentInvitation: StudentInvitation) {
      const body = JSON.stringify(studentInvitation);
      return api<UserServiceResponse<boolean>>(acceptInvitationUrl, body, "POST");
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T;
}
