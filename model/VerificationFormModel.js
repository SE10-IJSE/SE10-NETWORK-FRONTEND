export const postDataForOtp = (name, email) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/auth/request_otp?name=${name}&email=${email}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Otp sent successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Otp sent failed:", error);
      throw error;
    });
};

export const verifyOtp = (email, otp) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/auth/verify_otp?email=${email}&otp=${otp}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Otp verified successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Otp verification failed:", error);
      throw error;
    });
};
