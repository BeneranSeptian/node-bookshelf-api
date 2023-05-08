const {nanoid} = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const id = nanoid(16);
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	if (name === undefined || name === null || name === '') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});

		response.code(400);

		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});

		response.code(400);

		return response;
	}

	books.push(newBook);
	const response = h.response({
		status: 'success',
		message: 'Buku berhasil ditambahkan',
		data: {
			bookId: id,
		},
	});

	response.code(201);
	return response;
};

const getAllBooks = (request, h) => {
	const {name, reading, finished} = request.query;

	const allBooks = books.map((book) => ({
		id: book.id,
		name: book.name,
		publisher: book.publisher,
	}));

	if (name !== undefined) {
		const responseBody = getDataByQuery(name, 'name');
		return h.response({
			status: 'success',
			data: {
				books: responseBody,
			},
		}).code(200);
	}

	if (reading !== undefined) {
		const responseBody = getDataByQuery(reading, 'reading');
		return h.response({
			status: 'success',
			data: {
				books: responseBody,
			},
		}).code(200);
	}

	if (finished !== undefined) {
		const responseBody = getDataByQuery(finished, 'finished');
		return h.response({
			status: 'success',
			data: {
				books: responseBody,
			},
		}).code(200);
	}

	return h.response({
		status: 'success',
		data: {
			books: allBooks,
		},
	}).code(200);
};

const getBookById = (request, h) => {
	const {bookId} = request.params;

	const filteredBooks = books.filter((book) => book.id === bookId)[0];

	if (!filteredBooks) {
		return h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		}).code(404);
	}

	return h.response({
		status: 'success',
		data: {
			book: filteredBooks,
		},
	}).code(200);
};

const editBookById = (request, h) => {
	const {bookId} = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === bookId);

	if (index === -1) {
		return h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		}).code(404);
	}

	if (name === '' || name === null || name === undefined) {
		return h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		}).code(400);
	}

	if (readPage > pageCount) {
		return h.response({
			status: 'fail',
			message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		}).code(400);
	}

	books[index] = {
		...books[index],
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		updatedAt,
	};

	return h.response({
		status: 'success',
		message: 'Buku berhasil diperbarui',
	}).code(200);
};

const deleteBookById = (request, h) => {
	const {bookId} = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index === -1) {
		return h.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		}).code(404);
	}

	books.splice(index, 1);

	return h.response({
		status: 'success',
		message: 'Buku berhasil dihapus',
	}).code(200);
};
const getDataByQuery = (queryValue, queryType) => {
	const filtered = books.filter((book) =>{
		if (queryType === 'name') {
			return book.name.toLowerCase().includes(queryValue?.toLowerCase());
		}

		if (queryType === 'reading' && queryValue === '1') {
			return book.reading === true;
		}

		if (queryType === 'reading' && queryValue === '0') {
			return book.reading === false;
		}

		if (queryType === 'finished' && queryValue === '1') {
			return book.finished === true;
		}

		if (queryType === 'finished' && queryValue === '0') {
			return book.finished === false;
		}
	});

	return filtered.map((book) => ({
		id: book.id,
		name: book.name,
		publisher: book.publisher,
	}));
};

module.exports = {
	addBookHandler,
	getAllBooks,
	getBookById,
	editBookById,
	deleteBookById,
};
