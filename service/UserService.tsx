const classUrl = process.env.NEXT_PUBLIC_QUEMISTRY_CLASS_URL || ''
const saveUserServiceUrl = `${classUrl}`

export const UserService = {
  async addClass(data: Class) {
    console.log("calling saveClass ", saveUserServiceUrl);
    const res = await fetch(saveUserServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    console.log("res", res);
  }
}
