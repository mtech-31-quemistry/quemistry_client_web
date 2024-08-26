const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''

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
    const res = await fetch(classUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    console.log('res', res);
    return (await (res.json() as Promise<UserServiceResponse<ClassResponse>>)).payload;
  }
};

interface UserServiceResponse<T> {
  statusCode: string;
  statusMessage: string;
  serviceName: string;
  errors: string[];
  payload: T[];
}
