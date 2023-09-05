// module.exports = class Pagination {
//     constructor(currentPage = 1, totalItems = 0, limit = 10, offset = 0) {
//       this.currentPage = parseInt(currentPage);
//       this.totalItems = parseInt(totalItems);
//       this.limit = parseInt(limit);
//       this.offset = parseInt(offset);
//       this.totalPages = Math.ceil(this.totalItems / this.limit);
//       this.startIndex = (this.currentPage - 1) * this.limit + this.offset;
//       this.endIndex = this.startIndex + this.limit - 1;
//     }
  
//     calculatePagination() {
//       this.totalPages = Math.ceil(this.totalItems / this.limit);
//       this.startIndex = (this.currentPage - 1) * this.limit + this.offset;
//       this.endIndex = this.startIndex + this.limit - 1;
//     }
  
//     hasNextPage() {
//       return this.currentPage < this.totalPages;
//     }
  
//     hasPreviousPage() {
//       return this.currentPage > 1;
//     }
  
//     getNextPage() {
//       return this.currentPage + 1;
//     }
  
//     getPreviousPage() {
//       return this.currentPage - 1;
//     }
//   }
  

        module.exports = class Pagination {
            constructor(page = 1, paginationLimit = 15, totalItems = 0){
                this.limit = +paginationLimit
                this.offset = ((+page) - 1) * this.limit
                this.currentPage = +page
                this.totalItems = totalItems
                this.totalPages = Math.ceil(totalItems/paginationLimit)
            }
        }
