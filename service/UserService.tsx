import ApiHelper from '../lib/ApiHelper'

const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL}`
const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/accept-invitation`
const sendInvitationUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_STUDENTS_INVITATION_URL}/send-invitation`
const tutorProfileUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_TUTOR_URL}/profile`

import api from "./ConnectionService"

export const UserService = {
  async addClass(data: Class) {
    return await api<UserServiceResponseDto>({ url: classUrl, body: JSON.stringify(data), method: "POST" });
  },

  async updateClass(data: Class, classId: number) {
    return (await api<UserServiceResponse<ClassResponse[]>>({ url: classUrl, body: JSON.stringify({...data, id: classId}), method: "PUT" })).payload;
  },

  async getClasses() {
    return (await api<UserServiceResponse<ClassResponse[]>>({ url: getAllClassesUrl })).payload;
  },

    async getClassById(id: String) {
        return (await api<UserServiceResponse<ClassResponse>>({ url: classUrl + "/" + id })).payload;
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
      return data.payload as Tutor
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
