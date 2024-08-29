const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const getAllClassesUrl = `${process.env.NEXT_PUBLIC_QUEMISTRY_QUESTIONS_URL}/retrieve`

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
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T[];
}
