export const getTokenValidation = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/user/validate",
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

export const getBirthdayNames = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/user/birthday/names",
  };

  return axios(config)
    .then((response) => {
      console.log("Birthdays retrieved successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Request failed:", error);
      throw error;
    });
};
