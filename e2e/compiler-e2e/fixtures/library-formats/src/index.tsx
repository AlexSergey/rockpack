import { format } from './format';

export type LabelProps = {
  readonly text: string;
};

export const Label = ({ text }: LabelProps): React.JSX.Element => <span>{format(text)}</span>;

export { format };
