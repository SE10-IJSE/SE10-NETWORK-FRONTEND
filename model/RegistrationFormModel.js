export const postRegisterData = (formDataToSend) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/auth/sign_up`,
    data: formDataToSend,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios(config)
    .then((response) => {
      console.log("Registration successful:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Registration failed:", error);
      throw error;
    });
};
