import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // local Flask backend
});

export async function classifyComment(comment) {
  const { data } = await api.post("/predict", { comment });
  return data;
}
