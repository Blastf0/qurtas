// Validation Service for Qurtas backend operations

class ValidationService {
    /**
     * Validate book data
     * @param {Object} data 
     * @returns {Object} { isValid: boolean, errors: Array }
     */
    validateBook(data) {
        const errors = [];
        if (!data.title || data.title.trim() === '') {
            errors.push('Title is required');
        }
        if (!data.author || data.author.trim() === '') {
            errors.push('Author is required');
        }
        if (typeof data.totalPages !== 'number' || data.totalPages <= 0) {
            errors.push('Total pages must be a positive number');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate session data
     * @param {Object} data 
     * @param {Object} book (optional) to check against total pages
     * @returns {Object} { isValid: boolean, errors: Array }
     */
    validateSession(data, book = null) {
        const errors = [];
        if (!data.bookId) {
            errors.push('Book ID is required');
        }
        if (typeof data.startPage !== 'number' || data.startPage < 0) {
            errors.push('Start page must be 0 or greater');
        }
        if (data.endPage !== null && (typeof data.endPage !== 'number' || data.endPage < data.startPage)) {
            errors.push('End page must be greater than or equal to start page');
        }
        if (book && data.endPage > book.totalPages) {
            errors.push(`End page (${data.endPage}) exceeds total book pages (${book.totalPages})`);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

const validationService = new ValidationService();
