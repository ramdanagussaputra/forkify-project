import icon from 'url:../../img/icons.svg';
import View from './view';

class addRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _errorMessage = 'Wrong recipe input format, please input with correct format';
  _message = 'New recipe successfully added';
  _modal = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  toggle() {
    [this._modal, this._overlay].forEach(el => el.classList.toggle('hidden'));
  }

  closeModal() {
    [this._modal, this._overlay].forEach(el => el.classList.add('hidden'));
  }

  addHanlderShowModal() {
    this._btnOpen.addEventListener('click', this.toggle.bind(this));
  }

  addHandlerCloseModal() {
    [this._btnClose, this._overlay].forEach(el =>
      el.addEventListener('click', this.toggle.bind(this))
    );
  }

  addHandlerUpload(hanlder) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      hanlder(data);
    });
  }

  generateForm() {
    const markup = `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST16" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST16" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST16" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST16" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;

    this._clearInput();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new addRecipeView();
