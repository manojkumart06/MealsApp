
const Searchbox = document.querySelector(".Searchbox");
const fetchbutton = document.querySelector(".fetchbutton");
const meals_holder = document.querySelector(".meals_holder");
const mealDetailsPopup = document.querySelector('.meal-details-popup');
const mealImage = document.querySelector('.meal-image');
const mealTitle = document.querySelector('.meal-title');
const mealcategory = document.querySelector('.meal-category');
const mealArea = document.querySelector('.meal-area');
const mealInstructions = document.querySelector('.meal-instructions');
const youtubeLinkButton = document.querySelector('.youtube-link-button');
const closePopupButton = document.querySelector('.close-button');
const favoritemealslist = document.querySelector('.favorite-meals-list');

// Array to store favorite meals
let favouriteMeals = [];

// Function to fetch and display search results
const fetchSearchResults = async (q) => {
  meals_holder.innerHTML = '<h2>Searching for the Meals..............<h2>';
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
  const data = await response.json();
  meals_holder.innerHTML = ''; // Clear previous results
  data.meals.forEach(meal => {
    const mealItem = document.createElement('div');
    mealItem.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal};">
        <button class="view-details-button" onclick="showMealDetails('${meal.idMeal}')">More Info  <i class="fa-solid fa-circle-info"></i></i></button>
        <button class="addToFavourites-details-button" onclick="addToFavourites('${meal.idMeal}')"><i class="fa-solid fa-heart fa-beat"></i></button>
    `;
    meals_holder.appendChild(mealItem);
  });
}
  

fetchbutton.addEventListener('click', (event) => {
  event.preventDefault();
  const searchInput = Searchbox.value.trim();
  fetchSearchResults(searchInput);
  //console.log("Button pressed");
});

async function showMealDetails(mealId) {
  const mealDetails = await fetchMealDetails(mealId);

  if (mealDetails) {
    mealImage.src = mealDetails.strMealThumb;
    mealTitle.textContent = mealDetails.strMeal;
    mealcategory.textContent = mealDetails.strCategory;
    mealArea.textContent = mealDetails.strArea;
    mealInstructions.textContent = mealDetails.strInstructions;
    youtubeLinkButton.addEventListener('click', () => {
      const youtubeLink = mealDetails.strYoutube;
      window.open(youtubeLink, '_blank');
    });
    mealDetailsPopup.style.display = 'block';
  }
}

closePopupButton.addEventListener('click', () => {
  mealDetailsPopup.style.display = 'none';
});

async function fetchMealDetails(mealId) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error('Error fetching meal details:', error);
    return null;
  }
}


// Function to add a meal to favorites
async function addToFavourites(mealId) {
    try {
        const mealDetails = await fetchMealDetails(mealId);
        if (mealDetails) {
            favouriteMeals.push({ idMeal: mealId, data: mealDetails });
            updateFavouritesList();
        }
    } catch (error) {
        console.error('Error adding meal to favorites:', error);
    }
}


// Function to update the favorites list
function updateFavouritesList() {
    favoritemealslist.innerHTML = '';
    favouriteMeals.forEach((meal) => {
        const mealItem = document.createElement('div');
        mealItem.innerHTML = `
            <h2>${meal.data.strMeal}</h2>
            <img src="${meal.data.strMealThumb}" alt="${meal.data.strMeal}">
            <button class="view-details-button" onclick="showMealDetails('${meal.idMeal}')">More Info  <i class="fa-solid fa-circle-info"></i></button>
            <button class = "removeFromFavourites"onclick="removeFromFavourites('${meal.idMeal}')">Remove from Favourites</button>
        `;
        favoritemealslist.appendChild(mealItem);
    });

    // Save favorite meals to local storage whenever the list is updated
    saveFavouritesToLocalStorage();
}

// Function to remove a meal from favorites
function removeFromFavourites(mealId) {
    favouriteMeals = favouriteMeals.filter((meal) => meal.idMeal !== mealId);
    updateFavouritesList();
}

// Load favorite meals from local storage (make it persistent)
const storedFavourites = JSON.parse(localStorage.getItem('favouriteMeals'));
if (storedFavourites) {
    favouriteMeals = storedFavourites;
    updateFavouritesList();
}

// Save favorite meals to local storage
function saveFavouritesToLocalStorage() {
    localStorage.setItem('favouriteMeals', JSON.stringify(favouriteMeals));
}

// Call this function to save favorites to local storage whenever the list is updated
updateFavouritesList();



// Function to toggle the visibility of the favorite meals list
function toggleFavoriteMealsList() {
    const favoriteMealsList = document.querySelector('.favorite-meals-list');
    if (favoriteMealsList.style.display === 'none') {
      favoriteMealsList.style.display = 'block';
    } else {
      favoriteMealsList.style.display = 'none';
    }
  }
  




