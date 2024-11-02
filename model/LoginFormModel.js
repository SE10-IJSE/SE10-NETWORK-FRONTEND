export const postLoginData = (data) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/auth/sign_in`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };

  return axios(config)
    .then((response) => {
      console.log("Login successful:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Login failed:", error);
      throw error;
    });
};
