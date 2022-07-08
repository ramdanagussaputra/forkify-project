import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { RESULT_PER_PAGE } from './config.js';
import { KEY } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmark: [],
};

const recipeDataFormat = function (data) {
  return {
    cookingTime: data.cooking_time,
    id: data.id,
    imageUrl: data.image_url,
    ingredients: data.ingredients,
    publisher: data.publisher,
    servings: data.servings,
    sourceUrl: data.source_url,
    title: data.title,
    bookmark: false,
    ...(data.key && { key: data.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const {
      data: { recipe },
    } = await AJAX(`${API_URL}${id}`);

    state.recipe = recipeDataFormat(recipe);

    if (state.bookmark.some(bookObj => bookObj.id === id)) {
      state.recipe.bookmark = true;
    }
  } catch (err) {
    console.error(err);
    throw new Error();
  }
};

export const loadSearchResult = async function (query) {
  try {
    // Assign query
    state.search.query = query;

    // Fetching search result data
    const {
      data: { recipes },
    } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // prettier-ignore

    // Transform search result data
    state.search.result = recipes.map(recObj => {
      return {
        id: recObj.id,
        imageUrl: recObj.image_url,
        publisher: recObj.publisher,
        title: recObj.title,
        ...(recObj.key && { key: recObj.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw new Error();
  }
};

export const getResultPerPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.result.slice(start, end);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ingObj => {
    ingObj.quantity = (ingObj.quantity * newServing) / state.recipe.servings;
  });

  state.recipe.servings = newServing;
};

const updateBookmarkStorage = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);

  recipe.bookmark = true;
  updateBookmarkStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(bookObj => bookObj.id === id);
  state.bookmark.splice(index, 1);

  state.recipe.bookmark = false;
  updateBookmarkStorage();
};

export const uploadNewRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entryArr => entryArr[0].includes('ingredient') && entryArr[1] !== ''
      )
      .map(entryArr => {
        const ingredientItemArr = entryArr[1].split(',').map(ing => ing.trim());

        if (ingredientItemArr.length !== 3) throw new Error();

        const [quantity, unit, description] = ingredientItemArr;

        return { quantity, unit, description };
      });

    const dataNewRecipe = {
      cooking_time: newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const {
      data: { recipe },
    } = await AJAX(`${API_URL}?key=${KEY}`, dataNewRecipe);

    state.recipe = recipeDataFormat(recipe);
    addBookmark(state.recipe);

    console.log(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};

init();
