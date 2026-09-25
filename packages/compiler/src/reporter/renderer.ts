export type OutputStream = {
  readonly columns?: number;
  readonly isTTY?: boolean;
  write(text: string): boolean;
};

export type Renderer = {
  // Clears the live area and forgets it (nothing is building any more).
  clear(): void;
  // Prints lines above the live area, which is redrawn below them.
  print(lines: readonly string[]): void;
  // Replaces the live area with these rows (interactive only; plain output ignores it).
  update(rows: readonly string[]): void;
};

const CLEAR_LINE = '\u001B[2K\r';
const cursorUp = (count: number): string => `\u001B[${String(count)}A`;

// Keeps the live rows on one screen line each, so moving the cursor up by the row count is exact.
const fit = (row: string, columns: number): string => {
  // eslint-disable-next-line no-control-regex -- colour codes do not take screen space
  const visible = row.replace(/\u001B\[[0-9;]*m/g, '');

  return visible.length <= columns ? row : `${visible.slice(0, Math.max(0, columns - 1))}…`;
};

// Interactive: a live area of rows redrawn in place. Plain: lines only, never a cursor movement.
export const createRenderer = (stream: OutputStream, interactive: boolean): Renderer => {
  let rows: readonly string[] = [];

  const erase = (): void => {
    if (rows.length > 0) {
      stream.write(`${cursorUp(rows.length)}${CLEAR_LINE}`);
      stream.write(`${`${CLEAR_LINE}\n`.repeat(rows.length)}${cursorUp(rows.length)}`);
    }
  };

  const draw = (): void => {
    // A pseudo-terminal without a size reports 0 columns.
    const columns = stream.columns !== undefined && stream.columns > 0 ? stream.columns : 80;
    rows.forEach((row) => {
      stream.write(`${CLEAR_LINE}${fit(row, columns)}\n`);
    });
  };

  return {
    clear: (): void => {
      if (!interactive) {
        return;
      }
      erase();
      rows = [];
    },
    print: (lines): void => {
      if (lines.length === 0) {
        return;
      }
      if (interactive) {
        erase();
      }
      stream.write(`${lines.join('\n')}\n`);
      if (interactive) {
        draw();
      }
    },
    update: (next): void => {
      if (!interactive) {
        return;
      }
      erase();
      rows = next;
      draw();
    },
  };
};
