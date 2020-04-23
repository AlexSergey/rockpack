import React from 'react';
import styles from './text.button.modules.scss';

interface TextButtonInterface {
  text: string;
  disabled: boolean;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export const TextButton = ({ text = ' test', disabled = true, count, onClick = () => 'test' }: TextButtonInterface) => (
  <button className={styles.btn} disabled={disabled} onClick={onClick}>{text} {count}</button>
);
