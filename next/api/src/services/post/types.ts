export interface PostData {
  photos?: { filename: string }[];
  preview?: { filename: string };
  text: string;
  title: string;
}
