
export const mockdata = {
  test_column_space: {
    name: "test_column_space",
    columns: {
      test_file_column_uuid: {
        name: "test_file_column",
        type: "file",
        collapsable: false,
        child_columns_uuids: [
          "test_technique_column_uuid",
        ],
        datas: {
          sample_data_uuid: {
            path: "userdata/test_column_space/test_file_column_uuid/1125362.jpg",
            type: "img",
            name: "1125362.jpg",
            childs_columns_datas: {
              test_technique_column_uuid: {

              }
            }
          }
        },
      }
    }
  }
}
