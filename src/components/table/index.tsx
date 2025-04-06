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
} from "@chakra-ui/react";
import { CTableProps } from "@/types";
import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys)

  const baseStyle = definePartsStyle({
    table:{
      tableLayout: 'fixed'
    },
  })

  export const tableTheme = defineMultiStyleConfig({ baseStyle })


function CTable({ loading = false, rowData = [], columnData = [] }: CTableProps) {
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
              <Tr key={itemIndex}>
                {columnData.map((column, columnIndex) => {
                  const format = column?.format
                  if(format){
                    return <Td key={columnIndex}>{format(item[column.key])}</Td>;
                  }
                  return <Td key={columnIndex}>{item[column.key]}</Td>;
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
