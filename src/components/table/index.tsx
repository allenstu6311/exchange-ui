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
import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  table: {
    tableLayout: "fixed",
  },
});
export const tableTheme = defineMultiStyleConfig({ baseStyle });

function CTable({
  loading = false,
  rowData = [],
  columnData = [],
  rowStyle = {},
  trOnClick = () => {},
  virtualed = false,
  trHeight = 0,
}: CTableProps) {
  const tbodyRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: rowData.length,
    getScrollElement: () => tbodyRef.current,
    estimateSize: () => trHeight,
  });
  const renderRowData = virtualed ? rowVirtualizer.getVirtualItems() : rowData;

  return (
    <>
      <TableContainer>
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
          <Tbody height={virtualed ? trHeight * rowData.length + "px" : ""}>
            {renderRowData.map((data, index) => {
              const item = virtualed ? rowData[data.index] : data;
              const itemIndex = virtualed ? data.index : index;

              return (
                <Tr
                  key={itemIndex}
                  style={rowStyle}
                  onClick={() => trOnClick(item)}
                  position={virtualed ? "absolute" : "static"}
                  top={virtualed ? trHeight * itemIndex + "px" : ""}
                  className="w-full flex justify-between items-center gap-0"
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
