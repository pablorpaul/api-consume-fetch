const bookList = document.getElementById('bookList');
const bookDetail = document.getElementById('bookDetail');
const detailContent = document.getElementById('detailContent');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');

// Função de busca na API
async function searchBooks(query) {
    try {
        loading.classList.remove('hidden');
        bookList.innerHTML = ''; // Limpa resultados anteriores
        
        // A API da Open Library usa query params para busca
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
        
        if (!response.ok) throw new Error('Erro ao consultar a biblioteca');
        
        const data = await response.json();
        renderBooks(data.docs);
    } catch (error) {
        bookList.innerHTML = `<p style="color:red">Erro: ${error.message}</p>`;
    } finally {
        loading.classList.add('hidden');
    }
}

// Renderiza os livros
function renderBooks(books) {
    if (books.length === 0) {
        bookList.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    books.forEach(book => {
        // A API retorna um ID de capa (cover_i), se não tiver, usamos uma imagem padrão
        const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : 'https://via.placeholder.com/150x225?text=Sem+Capa';

        const div = document.createElement('div');
        div.classList.add('book-card');
        div.innerHTML = `
            <img src="${coverUrl}" alt="${book.title}">
            <h4>${book.title}</h4>
            <small>${book.author_name ? book.author_name[0] : 'Autor desconhecido'}</small>
        `;
        div.onclick = () => showDetail(book, coverUrl);
        bookList.appendChild(div);
    });
}

// Mostra detalhes (requisito: seleção de item)
function showDetail(book, coverUrl) {
    bookDetail.classList.remove('hidden');
    detailContent.innerHTML = `
        <img src="${coverUrl.replace('-M.jpg', '-L.jpg')}" style="width:100%; border-radius:8px">
        <h2>${book.title}</h2>
        <p><strong>Autor:</strong> ${book.author_name ? book.author_name.join(', ') : 'Não informado'}</p>
        <p><strong>Primeiro ano de publicação:</strong> ${book.first_publish_year || 'N/A'}</p>
        <p><strong>Assuntos:</strong> ${book.subject ? book.subject.slice(0, 5).join(', ') : 'Informação não disponível'}.</p>
        <p><strong>ISBN disponível:</strong> ${book.isbn ? book.isbn[0] : 'N/A'}</p>
    `;
}

function closeDetails() {
    bookDetail.classList.add('hidden');
}

// Eventos de busca
searchBtn.onclick = () => {
    if (searchInput.value) searchBooks(searchInput.value);
};

searchInput.onkeypress = (e) => {
    if (e.key === 'Enter' && searchInput.value) searchBooks(searchInput.value);
};

// Carregamento inicial (exemplo)
searchBooks('JavaScript');