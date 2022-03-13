/* eslint-disable no-underscore-dangle */
import { getDetails } from './tvmaze-api';
import './images/loading.svg';
import './images/close.svg';
import { addComment, getCommentList } from './Involvement-api';

export async function commentsCount(promise) {
  return promise
    .then((comments) => comments.length)
    .catch(() => 0);
}

export default class Details {
  _series;

  constructor(container = document.body) {
    this.container = container;
    this.detailsElement = document.createElement('section');
    this.detailsElement.classList.add('details');
    this.container.appendChild(this.detailsElement);
    this.series = undefined;
  }

  async init() {
    this.navigate(window.location.hash);
    window.addEventListener('popstate', () => this.navigate(window.location.hash));
  }

  get series() {
    return this._series;
  }

  set series(value) {
    if (value && value.then) {
      value.then((series) => {
        series.comments = getCommentList(series.id)
          .then((comments) => {
            series.comments = comments;
            this.update();
            return comments;
          })
          .catch(() => {
            series.comments = [];
            this.update();
            return series.comments;
          });
        series.commentsLenth = commentsCount(series.comments)
          .then((length) => {
            series.commentsLenth = length;
            this.update();
          });
        this.series = series;
      }).catch(() => this.navigate(window.location.hash));
    }
    this._series = value;
    this.update();
  }

  navigate(hash) {
    if (hash.startsWith('#details/')) {
      const id = Number.parseInt(hash.split('/')[1], 10);
      this.series = getDetails(id);
    } else { this.series = undefined; }
  }

  update() {
    this.detailsElement.innerHTML = `
      ${this.series ? `<div class="backdrop">
        <div class="modal">
          <button class="close"><img src="./images/close.svg"></button>
          <div class="series">
          ${this.series.then ? `
            <div class="img">
              <img src="./images/loading.svg">
            </div>
          ` : `
            <div class="img">
              <img src="${this.series.image.original}">
            </div>
            <div  class="info">
              <h2>${this.series.name}</h2>
              <div>${this.series.summary}</div>
              <div>
                <div>Rating</div>
                <div>${this.series.rating.average}</div>
                <div>Genres</div>
                <ul>${this.series.genres.map((tag) => `<li>${tag}</li>`).join('')}</ul>
                <div>Premiered</div>
                <div>${this.series.premiered}</div>
                <div>Status</div>
                <div>${this.series.status}</div>
              </div>
            </div>
            <h3>Comments (${this.series.commentsLenth.then ? '' : this.series.commentsLenth})</h3>
            <div class="comments">
            ${this.series.comments.then ? `
              <img src="./images/loading.svg">
            ` : `
              ${this.series.comments.map((comment) => `
                <div>${comment.creation_date}</div>
                <b>${comment.username}</b>
                <div>${comment.comment}</div>
              `).join('')}
            `}
            </div>
            <h3>Add a comment</h3>
            <form class="new-comment">
              <input name="username" placeholder="Your name" required>
              <textarea name="comment" placeholder="Your comment" required></textarea>
              <button> Comment </button>
            </form>
          `}
          </div>
        </div>
      </div>` : ''}
    `;
    document.querySelectorAll('.close').forEach((closeBtn) => closeBtn.addEventListener('click', () => window.history.back()));
    document.querySelectorAll('form').forEach((closeBtn) => closeBtn.addEventListener('submit', (e) => {
      e.preventDefault();
      e.currentTarget.querySelectorAll('button').forEach((btn) => { btn.disabled = true; });
      const newComment = {};
      new FormData(e.currentTarget).forEach((value, key) => { newComment[key] = value; });
      e.currentTarget.reset();
      commentsCount(addComment(this.series.id, newComment.username, newComment.comment)
        .then(() => getCommentList(this.series.id)
          .then((comments) => {
            this.series.comments = comments;
            return comments;
          })
          .catch(() => {
            this.series.comments = [];
            return [];
          })))
        .then((length) => {
          this.series.commentsLenth = length;
          this.update();
        });
    }));
  }
}