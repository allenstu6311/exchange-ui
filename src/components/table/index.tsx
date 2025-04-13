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

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  table: {
    tableLayout: "fixed",
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });

// const handleAttribute = (value: string) => {}

function CTable({
  loading = false,
  rowData = [],
  columnData = [],
  rowStyle = {},
}: CTableProps) {
  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            {columnData.map((columnName, index) => {
              return <Th key={index}>{columnName.label}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {rowData.map((item, itemIndex) => {
            return (
              <Tr key={itemIndex} style={rowStyle}>
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

                  if (column.render) {
                    return column.render(content, item, columnIndex);
                  } else {
                    return (
                      <Td key={columnIndex} style={style} className={className}>
                        {content}
                      </Td>
                    );
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
        {/* <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot> */}
      </Table>
    </TableContainer>
  );
}
export default CTable;
