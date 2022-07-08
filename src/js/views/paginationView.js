import icon from 'url:../../img/icons.svg';
import View from './view';

class paginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentEl.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.btn--inline');
        if (!btn) return;

        const goToPage = +btn.dataset.gotopage;
        handler(goToPage);
      }.bind(this)
    );
  }

  _generateMarkup() {
    const numPages = Math.ceil(this._data.result.length / this._data.resultPerPage); // prettier-ignore
    const curPage = this._data.page;

    // First page, have multiple page
    if (curPage === 1 && numPages > 1) {
      return this._generateNextBtn(curPage);
    }

    // First page, have no other page
    if (curPage === 1 && numPages < 1) {
      return ``;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generatePrevBtn(curPage);
    }

    // Other page
    return [
      this._generatePrevBtn(curPage),
      this._generateNextBtn(curPage),
    ].join('');
  }

  _generateNextBtn(curPage) {
    return `
        <button data-gotopage="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }

  _generatePrevBtn(curPage) {
    return `
        <button data-gotopage="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;
  }
}

export default new paginationView();
