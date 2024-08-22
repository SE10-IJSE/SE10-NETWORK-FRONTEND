export const postRegisterData = (data) => {
    console.log(data);
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `http://localhost:8080/api/v1/auth/sign_up`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    return axios(config)
        .then((response) => {
            console.log("Registration successful:", response.data);
            return response; // Return the response to handle in the controller
        })
        .catch((error) => {
            console.error("Registration failed:", error);
            throw error; // Propagate the error to be caught in the controller
        });
};
