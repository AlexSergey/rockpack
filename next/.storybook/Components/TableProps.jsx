import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import './styles.scss';

export const TableComponent = ({ propDefinitions }) => (
  <Table className="storybook-responsiveTable">
    <Thead>
      <Tr>
        <Th>Property:</Th>
        <Th>Type:</Th>
        <Th>Default:</Th>
        <Th>Description:</Th>
      </Tr>
    </Thead>
    <Tbody>{
      propDefinitions.map(
        ({ property, propType, required, description, defaultValue }) => (
          <Tr key={property}>
            <Td>
              <span className="props-name">{property}</span>
              {required ? <span style={{ color: 'red' }}>*</span> : null}
            </Td>
            <Td>{propType.name}</Td>
            <Td><span style={{fontStyle: 'italic'}}>{typeof defaultValue !== 'undefined' && defaultValue.toString()}</span></Td>
            <Td>{description}</Td>
          </Tr>
        )
      )
    }</Tbody>
  </Table>
);
