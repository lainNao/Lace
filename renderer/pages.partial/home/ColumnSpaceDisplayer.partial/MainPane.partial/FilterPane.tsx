import { CellViewer } from "../../../../components/CellViewer";
import { Cell, Column } from "../../../../models/ColumnSpaces"
import { Checkbox, Tag } from "@chakra-ui/react"
import { Formik, Field } from "formik";
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
  className: string;
  filterPaneData: FilterPaneData;
  onFilterUpdate: (checkedCellIds: FilterPaneCheckedData) => void,
  onSoundCellToggle: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
  onVideoCellToggle: (event) => void;
}

export type FilterPaneCheckedData = {
  [columnId: string]: string[];
}

export type FilterPaneData = {
  column: Column,
  cells: Cell[],
}[];

export const FilterPane = (props: Props) => {

  return (
    <div className={`${props.className}`}>

      <div className="mb-3">
        <Tag colorScheme="cyan">フィルタリング条件</Tag>
      </div>

      <Formik
        initialValues={{}}
        onSubmit={async (values) => {
        }}
        validate={(values) => {
          props.onFilterUpdate(values);
          return {};
        }}
      >
        {(formState) => {
          return (
            <form >
              <InfiniteScroll dataLength={props.filterPaneData.length} loader={<h4>Loading...</h4>} next={null} hasMore={false} className=" no-wrap break-all">
                {props.filterPaneData.map(data => (
                  <details key={data.column.id} className="mb-3" open>

                    {/* カラム */}
                    <summary className="mb-1 outline-none text-sm">{data.column.name}</summary>

                    {/* セル */}
                    <div className="ml-3 ">
                      <InfiniteScroll dataLength={data.cells.length} loader={<h4>Loading...</h4>} next={null} hasMore={false} className="flex flex-col no-wrap break-all">
                        {data.cells.map(cell => (
                          <Field key={cell.id} name={data.column.id} className="">
                            {({ field, form, props: formProps }) => (
                              <Checkbox {...field} {...formProps} size="sm" className="ml-1" key={cell.id} name={data.column.id} value={cell.id}>
                                <CellViewer
                                  cell={cell}
                                  className="mb-1 text-xs"
                                  onSoundCellToggle={props.onSoundCellToggle}
                                  onSoundCellPlay={props.onSoundCellPlay}
                                  onSoundCellPause={props.onSoundCellPause}
                                  onVideoCellToggle={props.onVideoCellToggle}
                                />
                              </Checkbox>
                            )}
                          </Field>
                        ))}
                      </InfiniteScroll>
                    </div>

                  </details>
                ))}
              </InfiniteScroll>
            </form>
          )
        }}
      </Formik>
    </div>
  )

}
