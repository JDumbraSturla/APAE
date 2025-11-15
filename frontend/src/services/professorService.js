import { api } from "./api";

const ProfessorService = {
  async getProfessor(id) {
    const res = await api.get(`/professor/${id}`);
    return res.data;
  },

  async updateProfessor(id, data) {
    const res = await api.patch(`/professor/${id}`, data);
    return res.data;
  },
};

export default ProfessorService;
