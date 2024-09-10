// --- save post (create-post-card) ---
export const savePost = (data) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/api/v1/post",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then((response) => {
      console.log("Post saved successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to save the post:", error);
      throw error;
    });
};

// --- update post ---
export const updatePost = (id, content) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post/${id}?content=${content}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config)
    .then((response) => {
      console.log("Post update successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to update the post:", error);
      throw error;
    });
};

// --- approve or decline a post ---
export const approveOrDeclinePost = (postId, status) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post/${postId}/status?status=${status}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Post status changed successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to change staus of the post:", error);
      throw error;
    });
};

// --- get post data ---
export const getPostData = (postId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post/${postId}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Post fetched successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to find the post:", error);
      throw error;
    });
};

// --- get all posts ---
export const getAllPosts = (pageNo) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post?pageNo=${pageNo}&postCount=10`,
  };

  return axios(config)
    .then((response) => {
      console.log("Posts fetched successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to find the posts:", error);
      throw error;
    });
};

// --- get all posts of a user ---
export const getAllPostsOfUser = (pageNo) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post/user?pageNo=${pageNo}&postCount=10`,
  };

  return axios(config)
    .then((response) => {
      console.log("Posts fetched successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to find the posts:", error);
      throw error;
    });
};

// --- get all unapproved posts ---
export const getUnapprovedPosts = (pageNo) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post/unapproved?pageNo=${pageNo}&postCount=10`,
  };

  return axios(config)
    .then((response) => {
      console.log("Unapproved posts fetched successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Unable to find the unapproved posts:", error);
      throw error;
    });
};

// --- delete post ---
export const deletePost = (postId) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/post/${postId}`,
  };

  return axios(config)
    .then((response) => {
      console.log("Post deleted successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.log("Post delete failed:", error);
      return error;
    });
};
