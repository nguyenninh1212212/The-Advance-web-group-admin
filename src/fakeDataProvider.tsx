import fakeDataProvider from 'ra-data-fakerest';
import jsonData from './fakedata.json';

const dataProvider = fakeDataProvider(jsonData);

export default dataProvider;
