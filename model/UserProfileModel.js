export const getUserData = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user`,
  };

  return axios(config)
    .then((response) => {
      console.log("Data Retrieved successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Data Retrieved successfully:", error);
      throw error;
    });
};

export const updateUserData = (data) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/user",
    data: data,
  };

  return axios(config)
    .then((response) => {
      console.log("Update successful:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Update failed:", error);
      throw error;
    });
};

export const updateUserPhoto = (formData) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/user/image",
    data: formData,
  };

  return axios(config)
    .then((response) => {
      console.log("Update successful:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Update failed:", error);
      throw error;
    });
};

export const deleteUserData = (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user/${id}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Delete successful:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Delete failed:", error);
      throw error;
    });
};

export const deleteUserPhoto = (data) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/user/image",
    data: data,
  };

  return axios(config)
    .then((response) => {
      console.log("Delete successful:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Delete failed:", error);
      throw error;
    });
};
