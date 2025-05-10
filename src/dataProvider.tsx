import { fetchUtils } from "ra-core";
import { DataProvider, GetListParams, GetOneParams, UpdateParams } from "ra-core";

const BASE_URL = process.env.VITE_API_URL;
const apiUrl = `${BASE_URL}/admin`;
const httpClient = (url: string, options: any = {}) => {
    const token = localStorage.getItem("accessToken");
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }
    if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

const dataProvider: DataProvider = {
    getList: (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination ?? { page: 1, perPage: 10 };
        const query = {
            page: page - 1,
            limit: perPage,
        };
        const { q, ...otherFilters } = params.filter ?? {};
        if (resource === "categories") {
        // Sử dụng API tìm kiếm riêng nếu có `q`
        const url = q
            ? `${apiUrl}/category/search?q=${encodeURIComponent(q)}`
            : `${apiUrl}/category/search`;

        return httpClient(url).then(({ json }) => {
            if (json.code === 1000 && json.result) {
                const allResults = json.result;
                const paginated = allResults.slice((page - 1) * perPage, page * perPage);
                return {
                    data: paginated.map((item: any) => ({ id: item.id, ...item })),
                    total: allResults.length,
                };
            } else {
                throw new Error("API trả về dữ liệu không hợp lệ.");
            }
        });
    }
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ json }) => {
            if (json.code === 1000 && json.result) {
                return {
                    data: json.result.data.map((item: any) => ({
                        id: item.id +1,
                        ...item,
                    })),                 
                    total: json.result.total,
                };
            } else {
                throw new Error("API trả về dữ liệu không hợp lệ.");
            }
        });
    },

    getMany: (resource: string, params: any) => {
        const query = {
            ids: params.ids,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ json }) => ({
            data: json,
        }));
    },

    getManyReference: (resource: string, params: any) => {
        const { page, perPage } = params.pagination ?? { page: 1, perPage: 10 };
        const query = {
            target: params.target,
            id: params.id,
            page: page - 1,
            limit: perPage,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url).then(({ json }) => ({
            data: json.data,
            total: json.total,
        }));
    },

    updateMany: (resource: string, params: any) => {
        const url = `${apiUrl}/${resource}`;
        return httpClient(url, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: json,
        }));
    },

    deleteMany: (resource: string, params: any) => {
        const query = {
            ids: params.ids,
        };
        const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
        return httpClient(url, {
            method: "DELETE",
        }).then(({ json }) => ({
            data: json,
        }));
    },

    getOne: (resource: string, params: GetOneParams) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    create: (resource: string, params: any) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: json,
        })),

    update: (resource: string, params: UpdateParams) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: json,
        })),

    delete: (resource: string, params: any) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "DELETE",
        }).then(({ json }) => ({
            data: json,
        })),
};

export default dataProvider;
