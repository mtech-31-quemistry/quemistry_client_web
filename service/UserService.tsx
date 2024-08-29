const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${classUrl}/retrieve`

export const UserService = {
  async addClass(data: Class) {
    await api<void>(classUrl,JSON.stringify(data), 'POST');
  },

  async getClasses() {
    return (await api<UserServiceResponse<ClassResponse[]>>(getAllClassesUrl)).payload;
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T;
}
