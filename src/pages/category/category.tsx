import { List, SimpleList, Datagrid, TextField, ReferenceField, DateField, FunctionField } from 'react-admin';



const CategoriesList = () => (
    <List>
        <Datagrid
            sx={{
            '& .RaDatagrid-headerCell': {
                backgroundColor: '#3f51b5', // Màu nền của tiêu đề
                color: '#fff', // Màu chữ của tiêu đề
                padding: '16px', // Padding của tiêu đề
                fontWeight: 'bold', // Đậm chữ tiêu đề
            }

        }}
        >
            <TextField source="id" />
            <DateField source="created_at" />
            <DateField source="delete_at" />
            <DateField source="updated_at" />
            <TextField source="Name" label = "Category name" />
            
        </Datagrid>
    </List>
);

export default CategoriesList;

/*

        <SimpleList 
            primaryText={record => record.title} // Trường chính: tiêu đề bài đăng
            secondaryText={record => record.content} // Nội dung bài đăng

            tertiaryText={record => (
                <>
                    <ReferenceField source="author_id" reference="authors" record={record} basePath="/authors" link={false}>
                        <TextField source="name" />
                    </ReferenceField>
                    {' - ' + new Date(record.created_at).toLocaleDateString()}
                </>
            )}// Hiển thị người đăng + ngày tạo            
        />
const PostPanel = () => {
    return (
        <div>
            <h1>Post Panel</h1>
            <p>This is the post panel content.</p>
        </div>
    );
}
<Datagrid
expand={PostPanel} // Mở rộng panel bên trái
rowClick="expand" // Mở rộng dòng khi nhấp chuột
bulkActionButtons={false} // Ẩn nút hành động hàng loạt
sx={{
'& .RaDatagrid-headerCell': {
    backgroundColor: '#3f51b5', // Màu nền của tiêu đề
    color: '#fff', // Màu chữ của tiêu đề
    padding: '16px', // Padding của tiêu đề
    fontWeight: 'bold', // Đậm chữ tiêu đề
}

}}

*/