import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  background,
} from "@chakra-ui/react";
import { CTableProps } from "@/types";
import { useRef } from "react";
import "./style.css";
import { useVirtualScroll } from "./hook";
import { getElementScrollbarWidth } from "./utils";

function CTable({
  loading = false,
  rowData = [],
  columnData = [],
  rowStyle = {},
  trOnClick = () => { },
  virtualed = false,
  trHeight = 0,
  isHover = false,
}: CTableProps) {
  const tbodyRef = useRef<HTMLDivElement>(null);
  const scrollbarWidth = getElementScrollbarWidth(tbodyRef.current)

  const { virtualItems, totalHeight } = useVirtualScroll({
    rowHeight: trHeight,
    ref: tbodyRef,
    count: rowData.length,
  })
  const renderRowData = virtualed ? virtualItems : rowData;

  const getItem = (data: any, index: number) => virtualed ? rowData[data.index] : data;
  const getItemIndex = (data: any, index: number) => virtualed ? data.index : index;
  const getRowPosition = (itemIndex: number): React.CSSProperties =>
    virtualed ? { position: "absolute", top: trHeight * itemIndex + "px" } : {};
  const getTbodyHeight = () => virtualed ? trHeight * rowData.length + "px" : "";

  return (
    <>
      <TableContainer pr={`${scrollbarWidth}px`}>
        <Table>
          <Thead>
            <Tr>
              {columnData.map((columnName, index) => {
                return (
                  <Th hidden={columnName.label === ""} key={index}>
                    {columnName.label}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
        </Table>
      </TableContainer>
      <TableContainer
        className="h-full relative"
        overflowY="auto"
        ref={tbodyRef}
      >
        <Table variant="simple" size="sm">
          <Tbody height={getTbodyHeight()}>
            {renderRowData?.map((data, index) => {
              const item = getItem(data, index);
              const itemIndex = getItemIndex(data, index);

              return (
                <Tr
                  key={itemIndex}
                  style={{ ...rowStyle, ...getRowPosition(itemIndex) }}
                  className={`${isHover && "tr-hover-style"
                    } w-full flex justify-between items-center gap-0`}
                  onClick={() => trOnClick(item)}
                >
                  {columnData.map((column, columnIndex) => {
                    // 欄位值
                    const rawValue = item[column.key]?.toString();
                    // 是否需要format
                    const content = column.format
                      ? column.format(rawValue, item)
                      : rawValue;
                    // 動態樣式
                    const style = column.getStyle
                      ? column.getStyle(rawValue, item)
                      : undefined;

                    // 動態className
                    const className =
                      typeof column.className === "function"
                        ? column.className(rawValue, item)
                        : column.className;
                    return (
                      <Td
                        key={columnIndex}
                        style={style}
                        className={`${className} text-center w-full`}
                      >
                        {column.render
                          ? column.render(content, item, columnIndex)
                          : content}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
export default CTable;
