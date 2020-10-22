import React from 'react';
import styles from './styles.module.scss';

export const TableComponent = ({ propDefinitions }) => (
  <div className={styles['table-wrap']}>
    <table>
      <thead>
      <tr>
        <th>Property:</th>
        <th>Type:</th>
        <th>Default:</th>
        <th>Description:</th>
      </tr>
      </thead>
      <tbody>
      {propDefinitions.map(({ property, propType, required, description, defaultValue }) => (
        <tr key={property}>
          <td data-label="Property:">
            <span className="props-name">{property}</span>
            {required ? <span style={{ color: 'red' }}>*</span> : null}
          </td>
          <td data-label="Type:">{propType.name}</td>
          <td data-label="Default:">
            <span style={{ fontStyle: 'italic' }}>{typeof defaultValue !== 'undefined' && defaultValue.toString()}</span>
          </td>
          <td data-label="Description:">{description}</td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
);
