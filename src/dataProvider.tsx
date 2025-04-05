import { fetchUtils } from 'ra-core';
import { DataProvider, GetListParams, GetOneParams, UpdateParams } from 'ra-core'; // Import các kiểu cần thiết

// URL API chính của bạn
const apiUrl = './fakedata.json'; // Thay bằng URL API của bạn
const httpClient = fetchUtils.fetchJson;

const dataProvider: DataProvider = {
    // Lấy danh sách dữ liệu (GET /resource)
    getList: (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination ?? { page: 1, perPage: 10 };
        const { field, order } = params.sort ?? { field: 'id', order: 'ASC' };
        const query = {
            _sort: field,
            _order: order,
            _start: (page - 1) * perPage,
            _end: page * perPage,
            ...params.filter,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ headers, json }) => {
            if (!headers.has('x-total-count')) {
                throw new Error('The X-Total-Count header is missing in the HTTP Response.');
            }
            return {
                data: json,
                total: parseInt(headers.get('x-total-count') || '0', 10),
            };
        });
    },

    // Lấy dữ liệu của 1 bản ghi (GET /resource/:id)
    getOne: (resource: string, params: GetOneParams) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    // Lấy dữ liệu của nhiều bản ghi (GET /resource?id[]=1&id[]=2...)
    getMany: (resource, params) => {
        const query = { id: params.ids };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    // Lấy dữ liệu liên quan (GET /resource?target=id)
    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination ?? { page: 1, perPage: 10 };
        const { field, order } = params.sort ?? { field: 'id', order: 'ASC' };
        const query = {
            _sort: field,
            _order: order,
            _start: (page - 1) * perPage,
            _end: page * perPage,
            ...params.filter,
            [params.target]: params.id,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ headers, json }) => {
            if (!headers.has('x-total-count')) {
                throw new Error('The X-Total-Count header is missing in the HTTP Response.');
            }
            return {
                data: json,
                total: parseInt(headers.get('x-total-count') || '0', 10),
            };
        });
    },

    // Tạo dữ liệu mới (POST /resource)
    create: (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const options = {
            method: 'POST',
            body: JSON.stringify(params.data),
        };

        return httpClient(url, options).then(({ json }) => {
            return {
                data: { ...json },
            };
        });
    },

    // Cập nhật dữ liệu (PUT /resource/:id)
    update: (resource: string, params: UpdateParams) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    // Cập nhật nhiều bản ghi (PUT /resource)
    updateMany: (resource, params) => {
        const query = { id: params.ids };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    // Xóa dữ liệu (DELETE /resource/:id)
    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    // Xóa nhiều bản ghi (DELETE /resource?id[]=1&id[]=2...)
    deleteMany: (resource, params) => {
        const query = { id: params.ids };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    },
};

export default dataProvider;
