import axios from "./axios";

export const getStudents = () =>
  axios.get("/students?institution_id=1");

export const createStudent = (data) =>
  axios.post("/students", data);

export const updateStudent = (id, data) =>
  axios.put(`/students/${id}`, data);

export const deleteStudent = (id) =>
  axios.delete(`/students/${id}`);
