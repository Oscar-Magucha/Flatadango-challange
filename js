// Base URL for API
const API_URL = 'https://your-api-url.com';

// Function to fetch all films
function fetchFilms() {
    fetch(`${API_URL}/films`)
        .then(response => response.json())
        .then(films => {
            renderFilmsList(films);
            fetchFirstFilmDetails(films[0].id); // Default to first film
        });
}

// Function to render the films list
function renderFilmsList(films) {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = ''; // Clear previous list

    films.forEach(film => {
        const li = document.createElement('li');
        li.className = 'film-item';
        li.textContent = film.title;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFilm(film.id);
        
        li.appendChild(deleteButton);
        
        filmsList.appendChild(li);
    });
}

// Function to fetch a film's details by ID
function fetchFilmDetails(filmId) {
    fetch(`${API_URL}/films/${filmId}`)
        .then(response => response.json())
        .then(film => displayFilmDetails(film));
}

// Function to display the film details
function displayFilmDetails(film) {
    document.getElementById('movie-poster').src = film.poster;
    document.getElementById('movie-title').textContent = film.title;
    document.getElementById('movie-runtime').textContent = `Runtime: ${film.runtime} mins`;
    document.getElementById('movie-showtime').textContent = `Showtime: ${film.showtime}`;
    document.getElementById('movie-description').textContent = film.description;
    document.getElementById('available-tickets').textContent = `Tickets Available: ${film.capacity - film.tickets_sold}`;

    const buyTicketButton = document.getElementById('buy-ticket-button');
    if (film.capacity - film.tickets_sold === 0) {
        buyTicketButton.textContent = 'Sold Out';
        buyTicketButton.disabled = true;
        document.querySelector('.film-item').classList.add('sold-out');
    } else {
        buyTicketButton.textContent = 'Buy Ticket';
        buyTicketButton.disabled = false;
    }

    buyTicketButton.onclick = () => buyTicket(film);
}

// Function to buy a ticket (PATCH request)
function buyTicket(film) {
    const updatedTicketsSold = film.tickets_sold + 1;

    // Update the tickets sold
    fetch(`${API_URL}/films/${film.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tickets_sold: updatedTicketsSold,
        }),
    })
    .then(response => response.json())
    .then(updatedFilm => {
        displayFilmDetails(updatedFilm);
        // Optionally, make a POST request to save the ticket purchase in the database
        postTicketPurchase(updatedFilm.id, 1); // Assume 1 ticket bought
    });
}

// Function to post ticket purchase (POST request)
function postTicketPurchase(filmId, numberOfTickets) {
    fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            film_id: filmId,
            number_of_tickets: numberOfTickets,
        }),
    })
    .then(response => response.json())
    .then(ticket => {
        console.log('Ticket purchased:', ticket);
    });
}

// Function to delete a film (DELETE request)
function deleteFilm(filmId) {
    fetch(`${API_URL}/films/${filmId}`, {
        method: 'DELETE',
    })
    .then(() => {
        const filmItem = document.querySelector(`[data-id="${filmId}"]`);
        filmItem.remove();
    });
}

// Initialize the app
fetchFilms();
