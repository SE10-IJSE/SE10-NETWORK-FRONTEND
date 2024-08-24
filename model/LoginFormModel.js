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
      console.log("Login successful:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Login failed:", error);
      throw error;
    });
};

export const getTokenValidation = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/auth/validate",
  };

  return axios(config)
    .then((response) => {
      console.log("Validation successful:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Validation failed:", error);
      throw error;
    });
};
