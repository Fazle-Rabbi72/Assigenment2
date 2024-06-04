const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const cartList = document.getElementById('cart-list');
const playerContainer = document.getElementById('player');
const playerDetailsContent = document.querySelector('.player-details-content');
const playerDetailsContainer = document.querySelector('.player-details-container');
const groupContainer = document.getElementById('group-card');
const totalMembersSpan = document.getElementById('total-members');
const totalMaleSpan = document.getElementById('total-male');
const totalFemaleSpan = document.getElementById('total-female');

let group = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchPlayerDetails('M');
});

const fetchPlayerDetails = async (playerName) => {
    playerContainer.innerHTML = "<h2>Loading Player Details...</h2>";
    try {
        const data = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`);
        const response = await data.json();
        playerContainer.innerHTML = "";

        if (response.player) {
            response.player.forEach(player => {
                if (player.strThumb) {
                    const playerDiv = document.createElement('div');
                    playerDiv.classList.add('player');
                    playerDiv.innerHTML = `
                        <img src="${player.strThumb}" alt="${player.strPlayer}" onerror="this.onerror=null;this.src='default-image.png'; console.error('Image not found: ${player.strThumb}');">
                        <h3>${player.strPlayer}</h3>
                        <p><strong>Country:</strong> ${player.strNationality}</p>
                        <p><strong>Date of Birth:</strong> ${player.dateBorn}</p>
                        <p><strong>Sports Type:</strong> ${player.strSport}</p>
                        <p><strong>Team Name:</strong> ${player.strTeam}</p>
                        <p><strong>Position:</strong> ${player.strPosition}</p>
                        <p><strong>Gender:</strong> ${player.strGender}</p>
                        <p>
                        ${player.strFacebook ? `<a href="https://${player.strFacebook}" target="_blank" class="social-icon"><i class="fab fa-facebook"></i></a>` : ''}
                        ${player.strInstagram ? `<a href="https://${player.strInstagram}" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>` : ''}
                        ${player.strTwitter ? `<a href="https://${player.strTwitter}" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>` : ''}
                        </p>
                    `;
                    const viewButton = document.createElement('button');
                    viewButton.textContent = "View Player Details";
                    playerDiv.appendChild(viewButton);
                    viewButton.classList.add("btn1");

                    viewButton.addEventListener('click', () => {
                        openPlayerPopup(player);
                    });

                    const groupButton = document.createElement('button');
                    groupButton.textContent = "Add to Group";
                    playerDiv.appendChild(groupButton);

                    groupButton.addEventListener('click', () => {
                        addToGroup(`${player.idPlayer}`, `${player.strPlayer}`, `${player.strGender}`, `${player.strThumb}`);
                    });

                    playerContainer.appendChild(playerDiv);
                }
            });
        } else {
            playerContainer.innerHTML = "<h2>No player details found</h2>";
        }
    } catch (error) {
        console.error("Error fetching player details:", error);
        playerContainer.innerHTML = "<h2>Error loading player details</h2>";
    }
}

const openPlayerPopup = (player) => {
    const description = player.strDescriptionEN ? player.strDescriptionEN.split(' ').slice(0, 10).join(' ') + '...' : 'No description available.';
    
    playerDetailsContent.innerHTML = `
        <button class="player-close-btn" onclick="closePlayerPopup()">Close</button>
        <h2>${player.strPlayer}</h2>
        <img src="${player.strThumb}" alt="${player.strPlayer}" onerror="this.onerror=null;this.src='default-image.png'; console.error('Image not found: ${player.strThumb}');">
        <p><strong>Name:</strong> ${player.strPlayer}</p>
        <p><strong>Date of Birth:</strong> ${player.dateBorn}</p>
        <p><strong>Salary:</strong> ${player.strWage}</p>
        <p><strong>Team Name:</strong> ${player.strTeam}</p>
        <p><strong>Position:</strong> ${player.strPosition}</p>
        <p><strong>Sports Type:</strong> ${player.strSport}</p>
        <p><strong>Country:</strong> ${player.strNationality}</p>
        <p><strong>Gender:</strong> ${player.strGender}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${player.strFacebook ? `<a href="https://${player.strFacebook}" target="_blank" class="social-icon"><i class="fab fa-facebook"></i></a>` : ''}
        ${player.strTwitter ? `<a href="https://${player.strTwitter}" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>` : ''}
        ${player.strInstagram ? `<a href="https://${player.strInstagram}" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>` : ''}
    `;
    playerDetailsContainer.style.display = 'block'; 
}

const closePlayerPopup = () => {
    playerDetailsContainer.style.display = 'none'; 
}

function addToGroup(id, name, gender, imgSrc) {
    if (group.some(player => player.id === id)) {
        alert('Player is already in the group');
        return;
    }

    if (group.length >= 11) {
        alert('Cannot add more than 11 players to the group');
        return;
    }

    group.push({ id, name, gender, imgSrc });
    updateCart();
}


function updateCart() {
    cartList.innerHTML = '';
    let totalMale = 0;
    let totalFemale = 0;
    group.forEach(player => {
        let listItem = document.createElement('li');

       
        let img = document.createElement('img');
        img.src = player.imgSrc || 'default-image.png'; 
        img.alt = player.name;
        img.style.width = '50px'; 
        img.style.height = '50px'; 
        img.style.marginRight = '10px'; 
        img.style.borderRadius = '100px';

      
        let nameSpan = document.createElement('span');
        nameSpan.textContent = player.name;
        nameSpan.classList.add("namelist")

        listItem.appendChild(img);
        listItem.appendChild(nameSpan);

        cartList.appendChild(listItem);

        if (player.gender === 'Male') totalMale++;
        else if (player.gender === 'Female') totalFemale++;
    });

    totalMembersSpan.textContent = group.length; 
    totalMaleSpan.textContent = totalMale;
    totalFemaleSpan.textContent = totalFemale;
}
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        playerContainer.innerHTML = "<h2>Please Type a Player Name in the Search Box!</h2>";
        return;
    }
    fetchPlayerDetails(searchInput);
});
