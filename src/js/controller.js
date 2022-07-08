import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { TIMEOUT_CLOSE_MODAL, TIMEOUT_GENERATE_FORM } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // Get Api id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update selected result
    resultView.update(model.getResultPerPage());
    bookmarkView.update(model.state.bookmark);

    // Render spinner
    recipeView.renderSpinner();

    // Fetching recipe data
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    // Get the query
    const query = searchView.getQuery();
    if (!query) return;

    // Render spinner
    resultView.renderSpinner();

    // Fecthing the query
    await model.loadSearchResult(query);

    // Render initial search result per page
    resultView.render(model.getResultPerPage(1));

    // Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotToPage) {
  // Render new search result
  resultView.render(model.getResultPerPage(gotToPage));

  // Render new pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // Update serving data
  model.updateServing(newServing);

  // Re-Render recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the bookmark button
  recipeView.update(model.state.recipe);

  // Render bookmark
  bookmarkView.render(model.state.bookmark);
};

const controlLoadBookmark = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload new recipe
    await model.uploadNewRecipe(newRecipe);

    // Render success message
    addRecipeView.renderMessage();

    // Render bookmark
    bookmarkView.render(model.state.bookmark);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Close modal automatically
    setTimeout(
      addRecipeView.closeModal.bind(addRecipeView),
      TIMEOUT_CLOSE_MODAL
    );

    // Change the url id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Re-render form
    setTimeout(
      addRecipeView.generateForm.bind(addRecipeView),
      TIMEOUT_GENERATE_FORM
    );
  } catch (err) {
    console.error(err);
    addRecipeView.renderError();
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlLoadBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServing(controlServing);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerCloseModal();
  addRecipeView.addHanlderShowModal();
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
