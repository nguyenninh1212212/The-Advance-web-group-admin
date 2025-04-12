import { fetchUtils } from 'react-admin';

// Cấu hình HTTP client để xử lý các yêu cầu API
const httpClient = fetchUtils.fetchJson;

const customDataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination; // Lấy thông tin phân trang
        const { field, order } = params.sort; // Lấy thông tin sắp xếp

        // URL API
        const url = `http://localhost:8080/${resource}?page=${page - 1}&limit=${perPage}&sort=${field}&order=${order}`;

        const { json } = await httpClient(url); // Gửi yêu cầu HTTP
        return {
            data: json.data, // Trả về danh sách người dùng
            total: json.total, // Tổng số lượng người dùng
        };
    },

    // Thêm các phương thức khác như getOne, create, update, delete
    getOne: async (resource, params) => {
        const url = `http://localhost:8080/${resource}/${params.id}`;
        const { json } = await httpClient(url);
        return { data: json };
    },

    // Xử lý phương thức thêm mới
    create: async (resource, params) => {
        const url = `http://localhost:8080/${resource}`;
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    },

    // Xử lý phương thức cập nhật
    update: async (resource, params) => {
        const url = `http://localhost:8080/${resource}/${params.id}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    },

    // Xử lý phương thức xóa
    delete: async (resource, params) => {
        const url = `http://localhost:8080/${resource}/${params.id}`;
        const { json } = await httpClient(url, { method: 'DELETE' });
        return { data: json };
    },
};

export default customDataProvider;
