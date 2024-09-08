export const searchUsers = (searchTerm, pageNo) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user/search?name=${searchTerm}&pageNo=${pageNo}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config)
    .then((response) => {
      console.log("Search successful:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Search failed:", error);
      throw error;
    });
};
