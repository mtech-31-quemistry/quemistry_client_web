const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''

export const UserService = {
  async addClass(data: Class) {
    const res = await fetch(classUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'QUESESSION=f1d94def-900a-4643-bce9-df86cc8b1d7c'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    console.log('res', res);
  }
};
