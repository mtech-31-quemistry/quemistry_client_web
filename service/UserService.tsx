import Header from 'quill/formats/header';

const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL}`
const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/invitation/accept`
const sendInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/invitation/create`

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
    return (await api<UserServiceResponse<ClassResponse[]>>({ url: getAllClassesUrl })).payload;
  },

  async acceptInvitation(studentInvitation: StudentInvitation) {
      const body = JSON.stringify(studentInvitation);
      return api<UserServiceResponse<boolean>>({ url: acceptInvitationUrl, body, method: "POST" });
  },

  sendInvitation(inviteStudent: InviteStudent) {
      const body = JSON.stringify(inviteStudent);
      return api<UserServiceResponse<boolean>>({ url: sendInvitationUrl, body, method: "POST" });
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T;
}
