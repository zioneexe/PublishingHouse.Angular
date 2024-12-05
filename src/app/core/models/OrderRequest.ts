export interface OrderRequest {
  customerId: number | null,
  bookName: string
  authorName: string,
  genre: string,
  pages: number,
  publicationYear: number,
  quantity: number,
  printType: string,
  paperType: string,
  coverType: string,
  fasteningType: string,
  isLaminated: boolean,
  completionDate: string | null,
  coverImagePath: string | null
}