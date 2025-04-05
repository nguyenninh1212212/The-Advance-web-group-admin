import { DataProvider } from 'react-admin';
import { fetchUtils } from 'ra-core';

const apiUrl = 'https://your-api-url.com'; // Replace with your API URL
const httpClient = fetchUtils.fetchJson;

const dataProvider: DataProvider = {
    getList: (resource, params) => {
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
                throw new Error(
                    'The X-Total-Count header is missing in the HTTP Response.'
                );
            }
            return {
                data: json,
                total: parseInt(headers.get('x-total-count') || '0', 10),
            };
        });
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            id: params.ids,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
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
                throw new Error(
                    'The X-Total-Count header is missing in the HTTP Response.'
                );
            }
            return {
                data: json,
                total: parseInt(headers.get('x-total-count') || '0', 10),
            };
        });
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            id: params.ids,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: json,
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            id: params.ids,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    },
};

export default dataProvider;