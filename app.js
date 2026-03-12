const bookList = document.getElementById('bookList');
const bookDetail = document.getElementById('bookDetail');
const detailContent = document.getElementById('detailContent');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');

// Função para buscar na API
async function searchBooks(query) {
    try {
        loading.classList.remove('hidden');
        bookList.innerHTML = ''; // Limpa resultados anteriores
        
        // A API da Open Library usa query params para busca
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=18`);
        
        if (!response.ok) throw new Error('Erro ao consultar a biblioteca');
        
        const data = await response.json();
        renderBooks(data.docs);
    } catch (error) {
        bookList.innerHTML = `<p style="color:red">Erro: ${error.message}</p>`;
    } finally {
        loading.classList.add('hidden');
    }
}

// Renderiza os livros encontrados, buscando a imagem da capa
function renderBooks(books) {
    if (books.length === 0) {
        bookList.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    books.forEach(book => {
        // A API retorna um ID de capa (cover_i), caso não possua capa uma imagem padrão é colocada
        const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://placehold.co/150x225?text=Sem+Capa';

        const div = document.createElement('div'); //Cria os cards de livro
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

// Mostra detalhes do livro quando um dos cards é clickado.
function showDetail(book, coverUrl) {
    bookDetail.classList.remove('hidden');
    detailContent.innerHTML = `
        <img src="${coverUrl.replace('-M.jpg', '-L.jpg')}" style="width:100%; border-radius:8px">
        <h2>${book.title}</h2>
        <p><strong>Autor:</strong> ${book.author_name ? book.author_name.join(', ') : 'Não informado'}</p>
        <p><strong>Primeiro ano de publicação:</strong> ${book.first_publish_year || 'N/A'}</p>
        <p><strong>Publisher:</strong> ${book.publisher ? book.publisher.slice(0, 5).join(', ') : 'Informação não disponível'}.</p>
        <p><strong>ISBN disponível:</strong> ${book.isbn ? book.isbn[0] : 'N/A'}</p>
    `;
}

function closeDetails() {
    bookDetail.classList.add('hidden');
}

// Eventos de busca
//Busca ao clicar no botão de buscar livros
searchBtn.onclick = () => {
    if (searchInput.value) searchBooks(searchInput.value);
};
//Busca ao apertar a tecla enter e se tiver conteúdo na barra de pesquisa
searchInput.addEventListener('keypress', function(e){
    if (e.key === 'Enter' && searchInput.value) searchBooks(searchInput.value);
});

// Ao carregar a página executa uma busca programada para página não ficar vazia.
window.onload = searchBooks('JavaScript')