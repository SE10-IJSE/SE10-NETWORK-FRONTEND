export const getUserData = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user`,
  };

  return axios(config)
    .then((response) => {
      console.log("Data Retrieved successfully:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Data Retrieval failed:", error);
      throw error;
    });
};

export const getUserProfilePhoto = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/user/profileImg",
  };

  return axios(config)
    .then((response) => {
      console.log("Data Retrieved successfully");
      return response.data;
    })
    .catch((error) => {
      console.error("Data Retrieval failed:", error);
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
      console.log("Update successful:", response.status);
      return response;
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return Promise.reject({
          code: error.response.data.code,
          message: error.response.data.message,
        });
      } else {
        return Promise.reject(error);
      }
    });
};

export const deleteUser = (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user/${id}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Delete successful!");
      return response;
    })
    .catch((error) => {
      console.error("Delete failed:", error);
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
      console.log("Update successful:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Update failed:", error);
      throw error;
    });
};

export const updateUserPassword = (email, newPassword, otp) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/auth/update_password`,
    data: { email, newPassword, otp },
  };

  return axios(config)
    .then((response) => {
      console.log("Password update successful:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Password update failed:", error);
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
      console.log("Delete successful:", response.status);
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
      console.log("Delete successful:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Delete failed:", error);
      throw error;
    });
};

export const getFriendData = (email) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user/${email}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Data Retrieved successfully:", response.status);
      return response;
    })
    .catch((error) => {
      console.error("Data Retrieval failed:", error);
      throw error;
    });
};
