import React from 'react';
import styles from './text.button.modules.scss';

interface TextButtonInterface {
  text: string;
  disabled: boolean;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export const TextButton = ({ text, disabled = true, count, onClick = (): string => 'test' }: TextButtonInterface): JSX.Element => (
  <button type="button" className={styles.btn} disabled={disabled} onClick={onClick}>{text} {count}</button>
);
