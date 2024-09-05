const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL}/retrieve`
const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}`

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
    return (await api<UserServiceResponse<ClassResponse>>(getAllClassesUrl)).payload;
  },

  async acceptInvitation(studentInvitation: StudentInvitation) {
      console.log('accept invitation code', studentInvitation.invitationCode)
      const body = JSON.stringify(studentInvitation);

      const header = {userId: 'e2dbf729-5c52-485f-8900-2a8f6680de4c', userEmail: 'htet.raymond@gmail.com'};

      return api<UserServiceResponse<StudentInvitationResponse>>(acceptInvitationUrl, body, "POST", header);
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T[];
}
