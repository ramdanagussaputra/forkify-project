import icon from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class bookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookObj => previewView._generatePreviewMarkup(bookObj))
      .join('');
  }
}

export default new bookmarkView();
