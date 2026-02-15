// Google Books API Integration for Qurtas

class BookSearch {
    constructor() {
        this.apiKey = CONFIG.GOOGLE_BOOKS_API_KEY;
        this.baseUrl = CONFIG.GOOGLE_BOOKS_API_URL;
    }

    /**
     * Search for books using the Google Books API
     * @param {string} query Search terms (title, author, isbn)
     * @param {number} maxResults Number of results to return
     * @returns {Promise<Array>} Normalized book data
     */
    async search(query, maxResults = 20) {
        if (!query || query.trim().length === 0) return [];

        try {
            let url = `${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
            if (this.apiKey) {
                url += `&key=${this.apiKey}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Google Books API error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.items) {
                // No items found - try OpenLibrary as fallback?
                // For now just return empty
                return [];
            }

            return data.items.map(item => this.normalizeBook(item));
        } catch (error) {
            console.error('Book search failed:', error);
            showToast('Book search failed. Please try again.', 'error');
            return [];
        }
    }

    /**
     * Normalize Google Books API response to our Book model format
     * @param {Object} item Google Books Volume object
     * @returns {Object} Normalized data for Book constructor
     */
    normalizeBook(item) {
        const info = item.volumeInfo;

        // Extract ISBN-13 if available, otherwise ISBN-10
        const identifiers = info.industryIdentifiers || [];
        const isbn13 = identifiers.find(id => id.type === 'ISBN_13')?.identifier;
        const isbn10 = identifiers.find(id => id.type === 'ISBN_10')?.identifier;

        // Get the largest available thumbnail
        const coverUrl = info.imageLinks ?
            (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail) :
            null;

        // Clean up cover URL (Google sometimes returns http, but we want https)
        const secureCoverUrl = coverUrl ? coverUrl.replace('http://', 'https://') : null;

        return {
            title: info.title || 'Unknown Title',
            author: info.authors ? info.authors.join(', ') : 'Unknown Author',
            totalPages: info.pageCount || 0,
            isbn: isbn13 || isbn10 || null,
            coverUrl: secureCoverUrl,
            publisher: info.publisher || null,
            publishedDate: info.publishedDate || null,
            description: info.description || null,
            // We don't use id from Google directly as our local ID
            apiId: item.id
        };
    }

    /**
     * Fetch specific book details by ISBN
     * @param {string} isbn 
     * @returns {Promise<Object|null>}
     */
    async getByISBN(isbn) {
        const results = await this.search(`isbn:${isbn}`, 1);
        return results.length > 0 ? results[0] : null;
    }
}

// Create global instance
const bookSearch = new BookSearch();
