import axios from 'axios';

export class AttributeContractorService {
  /**
   * Envía múltiples archivos y atributos en un solo request (FormData)
   * @param contractor_id
   * @param attributes: Array<{ attribute_id: number, value: File|null }>
   */
  static async createMany(contractor_id: number, attributes: { attribute_id: number, value: File|null }[]) {
    const formData = new FormData();
    formData.append('contractor_id', String(contractor_id));
    attributes.forEach((attr, idx) => {
      formData.append(`attributes[${idx}][attribute_id]`, String(attr.attribute_id));
      if (attr.value) {
        formData.append(`attributes[${idx}][value]`, attr.value);
      }
    });
    return axios.post('/api/v1/attribute-contractors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}