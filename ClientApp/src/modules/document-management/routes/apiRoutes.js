export const apiRoutes = {  
//Document Management
documentCategories: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/DocumentCategory/all-categories`,
documentCategoriesPaginated: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/DocumentCategory/all-categories-paginated`,
document: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/Document`,
documentCategory: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/DocumentCategory`,
documentCategoryDetails: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/DocumentCategory/category-by-id`,
alldocuments: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/Document/all-documents`,
category_delete: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/DocumentCategory`,
document_delete: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/Document`,
documentsByCategoryId: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/Document/document-by-category-id`,
documentById: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/Document/document-by-id`,
fileByDocumentId: `${process.env.REACT_APP_DOCUMENT_MANAGEMENT_BACKEND}/api/document-management/Document/file-by-document-id`,

};