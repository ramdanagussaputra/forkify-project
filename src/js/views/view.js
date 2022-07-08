import icon from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (!data || data.length === 0) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clearInput();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this._parentEl.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];

      // Update Text content
      if (
        !curEl.isEqualNode(newEl) &&
        curEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update Attribute
      if (!curEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach(att => {
          curEl.setAttribute(att.name, att.value);
        });
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icon}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clearInput();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icon}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clearInput();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  _clearInput() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icon}#icon-loader"></use>
        </svg>
      </div>
      `;

    this._clearInput();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
