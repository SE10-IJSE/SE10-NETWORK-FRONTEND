export const getNotifications = (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/notification/user/${id}`,
    params: {
      pageNo: 0,
      notificationCount: 10
    }
  };

  return axios(config)
    .then((response) => {
      console.log("Data Retrieved successfully:", response.data);
      return response.data;  // Returning only the data
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          // Handle 404 specifically (e.g., no notifications found)
          console.warn("No notifications found for user ID:", id);
          return [];  // Return an empty array or handle as needed
        } else {
          // Handle other server errors
          console.error("Error occurred:", error.response.status, error.response.data);
        }
      } else {
        // Handle errors outside of the response (network issues, etc.)
        console.error("Network or unknown error occurred:", error.message);
      }
    });
};
