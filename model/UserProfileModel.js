export const getUserData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:8080/api/v1/user`,
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
  