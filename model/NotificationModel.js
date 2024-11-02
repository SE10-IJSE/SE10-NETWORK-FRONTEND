export const getNotifications = (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/notification/user/${id}`,
    params: {
      pageNo: 0,
      notificationCount: 10,
    },
  };

  return axios(config)
    .then((response) => {
      console.log("Data Retrieved successfully:", response.status);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          console.warn("No notifications found for user ID:", id);
          return [];
        } else {
          console.error(
            "Error occurred:",
            error.response.status,
            error.response.data
          );
        }
      } else {
        console.error("Network or unknown error occurred:", error.message);
      }
    });
};
