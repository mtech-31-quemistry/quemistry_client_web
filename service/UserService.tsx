import ApiHelper from '../lib/ApiHelper'

const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL}`
const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/invitation/accept`
const sendInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/invitation/create`
const tutorProfileUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_TUTOR_URL}/profile`

import api from "./ConnectionService"

export const UserService = {
  async addClass(data: Class) {
    const res = await api<UserServiceResponseDto>({ url: classUrl, body: JSON.stringify(data), method: "POST" });
    console.log('res', res);
    // const res = await fetch(classUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify(data)
    // });
    return res;
  },

  async updateClass(data: Class) {
    return (await api<UserServiceResponse<ClassResponse[]>>({ url: classUrl, body: JSON.stringify(data), method: "PUT", userId: '8da3cf6e-2822-4ea9-8cfc-4a83f3c4b7a2' })).payload;
  },

  async getClasses() {
    return (await api<UserServiceResponse<ClassResponse[]>>({ url: getAllClassesUrl, userId: '8da3cf6e-2822-4ea9-8cfc-4a83f3c4b7a2' })).payload;
  },

  async acceptInvitation(studentInvitation: StudentInvitation) {
      const body = JSON.stringify(studentInvitation);
      return api<UserServiceResponse<boolean>>({ url: acceptInvitationUrl, body, method: "POST" });
  },

  async sendInvitation(inviteStudent: InviteStudent) {
      const body = JSON.stringify(inviteStudent);
      return (await api<UserServiceResponse<boolean>>({ url: sendInvitationUrl, body, method: "POST" })).payload;
  },
  getTutorProfile(): Promise<Tutor| null| undefined>{
    return fetch(tutorProfileUrl,  {
      headers: ApiHelper.getRequestHeaders(),
      credentials: 'include'
    }).then((res) => {
      if(res.status === 200)
          return res.json();
      else if(res.status === 404){
         return null;
      }
      else{
          console.log("res", res);
          throw new Error(res.status + " at retieving profile.");
      }
    }).then((data) =>{
      if(data === null) return null;
      data.payload as Tutor
    });
  },
  updateTutorProfile(data: Tutor) {
    return fetch(tutorProfileUrl,
        {
          method: 'POST',
          headers: ApiHelper.getRequestHeaders(),
          credentials: 'include',
          body: JSON.stringify(data)
        },
      ).then((res) => {
          if(res.status === 200)
              return res.json();
          else{
              console.log("res", res);
              throw new Error(res.status + " at saving profile.");
          }
      }).then((data) =>
        data.payload as Tutor
      );
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T;
}
