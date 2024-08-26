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
