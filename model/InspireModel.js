export const saveInspiration = (data) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/inspire`,
    data: data,
  };

  return axios(config)
    .then((response) => {
      console.log("Inspiration saved successfully:", response.code);
      return response;
    })
    .catch((error) => {
      console.error("Unable to save inspiration:", error);
      throw error;
    });
};

export const deleteInspiration = (postId) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/inspire/post/${postId}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Inspiration deleted successfully:", response.code);
    })
    .catch((error) => {
      console.error("Unable to delete inspiration:", error);
      throw error;
    });
};
