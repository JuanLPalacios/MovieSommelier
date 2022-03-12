import { getList } from './tvmaze-api';
import './images/like.svg';
import { getLikesList, like } from './Involvement-api';

export async function seriesCount(promise) {
  return promise.then((list) => {
    list.count = list.length;
    return list;
  });
}

export default class Home {
  pages;

  seriesMap;

  _series;

  constructor(container = document.body, pageLength = 9) {
    this.container = container;
    this.homeElement = document.createElement('section');
    this.homeElement.classList.add('home');
    this.series = [];
    this.pageLength = pageLength;
    this.page = 0;
    this.like = (e) => like(e.currentTarget.dataset.id)
      .then(async () => {
        this.updateLikes(await getLikesList());
        this.updateList();
      });
  }

  get series() {
    // eslint-disable-next-line no-underscore-dangle
    return this._series;
  }

  set series(value) {
    this.pages = [];
    this.seriesMap = {};
    value.map((series) => {
      series.likes = 0;
      this.seriesMap[series.id] = series;
      return series;
    });
    for (let i = 0; i < value.length; i += this.pageLength) {
      this.pages.push(value.slice(i, i + this.pageLength));
    }
    // eslint-disable-next-line no-underscore-dangle
    this._series = value;
  }

  async init() {
    this.navigate(window.location.hash);
    window.addEventListener('popstate', () => this.navigate(window.location.hash));
    try {
      this.series = await seriesCount(getList());
      this.updateLikes(await getLikesList());
    } finally {
      this.container.appendChild(this.homeElement);
      this.updateList();
    }
  }

  updateLikes(likes) {
    likes.forEach((element) => {
      this.seriesMap[element.item_id].likes = element.likes;
    });
  }

  navigate(hash) {
    if (hash === '') hash = '#home/1';
    if (hash.startsWith('#home/')) {
      const page = Number.parseInt(hash.split('/')[1], 10) - 1;
      if (this.page !== page) {
        this.page = page;
        if (page < this.pages.length) this.updateList();
      }
    }
  }

  updateList() {
    this.homeElement.innerHTML = `
      ${this.series.count ? `<div class="paginator">${this.series.count} total items</div>` : ''}
      <ul class="movie-list"> 
          ${this.pages[this.page].map((series) => `
          <li class="movie card">
              <div class="img-placeholder">
                <img src="${series.image.medium}">
              </div>
              <header>
                  <h2>${series.name}</h2>
                  <div class="likes">
                      <button class="like" data-id="${series.id}"><img src="./images/like.svg"></button>
                      <span>${series.likes} likes</span>
                  </div>
              </header>
              <a href="#details/${series.id}" class="btn">Comments</a>
          </li>`).join('')}
      </ul>
      ${this.paginator()}
      `;
    document.querySelectorAll('.like').forEach((likeBtn) => likeBtn.addEventListener('click', this.like));
  }

  paginator() {
    return this.pages.length > 0 ? `<div class="paginator">
      ${this.page > 2 ? '<a href="#home/1" class="btn">1</a>' : ''}
      ${this.page > 3 ? '<span>...</span>' : ''}
      ${[...Array(Math.min(this.pages.length, Math.max(this.page + 3, 5))).keys()] // eslint-disable-next-line indent, max-len
      .slice(Math.max(Math.min(this.pages.length - 5, this.page - 2), 0)) // eslint-disable-next-line indent
      .map((page) => `<a href="#home/${page + 1}" class="btn">${page + 1}</a>`).join('')}
      ${this.pages.length - this.page > 4 ? '<span>...</span>' : ''}
      ${this.pages.length - this.page > 3 ? `<a href="#home/${this.pages.length}" class="btn">${this.pages.length}</a>` : ''}
    </div>` : '';
  }
}