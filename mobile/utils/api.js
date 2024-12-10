import axios from "axios";

const API_BASE_URL = "http://10.0.0.8:5000";
// const API_BASE_URL = "http://localhost:5000";

const api = axios.create({ baseURL: API_BASE_URL });

export const getMenuitems = async () => {
  try {
    const response = await api.get("/menuitems");
    return response.data;
  } catch (error) {
    console.error("error in fetching menus", error);
    return [];
  }
};

export const getMenuitem = async (categoryid, subcategoryid) => {
  try {
    let url = "/menuItem";
    if (subcategoryid) {
      url += `?subCategoryID=${subcategoryid}`;
    } else if (categoryid) {
      url += `?categoryId=${categoryid}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("error in fetching menus", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("error in fetching categories", error);
    return [];
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("error in fetching tasks", error);
    return [];
  }
};

export const createPost = async (task) => {
  try {
    const response = await api.post("/tasks", task);
    return response.data;
  } catch (error) {
    console.error("error in creating task", error);
    return null;
  }
};

export const updatePost = async (id, task) => {
  try {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error("error in creating task", error);
    return null;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("error in delete task", error);
    return null;
  }
};
