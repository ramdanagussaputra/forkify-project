import icon from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class resultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'Your query not found, Please try another menu';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookObj => previewView._generatePreviewMarkup(bookObj))
      .join('');
  }
}

export default new resultView();
