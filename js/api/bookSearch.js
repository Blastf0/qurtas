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
                return [];
            }

            const books = data.items.map(item => this.normalizeBook(item));

            // Smart Sort
            return books.sort((a, b) => {
                // Scoring function
                const getScore = (book) => {
                    let score = 0;

                    // Popularity/Market Reach (ratingsCount)
                    // This is our best proxy for sales volume
                    const popularity = book.ratingsCount || 0;
                    score += Math.log10(popularity + 1) * 3;


                    // Date factor (recentness)
                    if (book.publishedDate) {
                        const year = parseInt(book.publishedDate.substring(0, 4));
                        if (!isNaN(year)) {
                            // Boost more recent books (last 20 years)
                            const currentYear = new Date().getFullYear();
                            const age = currentYear - year;
                            if (age < 0) score += 5; // Future?
                            else if (age < 5) score += 3;
                            else if (age < 10) score += 2;
                            else if (age < 20) score += 1;
                        }
                    }

                    return score;
                };

                return getScore(b) - getScore(a);
            });
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
            ratingsCount: info.ratingsCount || null,
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
