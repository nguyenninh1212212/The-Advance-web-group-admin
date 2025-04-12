import simpleRestProvider from 'ra-data-simple-rest';

// Sử dụng API thật
const dataProvider = simpleRestProvider('http://localhost:8080/admin');

export default dataProvider;
