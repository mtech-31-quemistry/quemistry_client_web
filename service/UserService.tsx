const userServiceUrl = process.env.NEXT_PUBLIC_QUEMISTRY_USER_URL || ''
const saveUserServiceUrl =`${userServiceUrl}/v1/class`

export const UserService = {
  async addClass(userId: string, data: Class) {
    console.log("calling saveClass ", saveUserServiceUrl);
    const res = await fetch(saveUserServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': userId
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    console.log("res", res);
  }
}
