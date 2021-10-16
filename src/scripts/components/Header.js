export default class Header {
   /** Méthode Constructeur */
  constructor(element) {
    this.element = element;
    this.scrollPosition = 0;
    this.scrollLimit = 0.1;
    this.lastScrollPosition = 0;
    this.html = document.documentElement;
    

    this.init();
    this.initNavMobile();
  }
/** Méthode d'Initialisation */
  init() {
    console.log('voici le header');

    window.addEventListener('scroll', this.onScroll.bind(this));

    document.querySelectorAll('.bouton__menu').forEach(item => {
      item.addEventListener('click', event => {
        this.html.classList.remove('nav-is-active');
      })
    })
  }
/** Permet de savoir la position */
  onScroll(event) {
    this.lastScrollPosition = this.scrollPosition;
    this.scrollPosition = document.scrollingElement.scrollTop;

    this.setHeaderState();
    this.setDirectionState();
  }
 /** Permet de déterminer si le menu est caché ou non*/
  setHeaderState() {
    const scrollHeight = document.scrollingElement.scrollHeight;

    if (this.scrollPosition > scrollHeight * this.scrollLimit) {
      this.html.classList.add('header-is-hidden');
    } else {
      this.html.classList.remove('header-is-hidden');
    }
  }
/** Permet de savoir la direction du scroll*/
  setDirectionState() {
    if (this.scrollPosition >= this.lastScrollPosition) {
      this.html.classList.add('is-scrolling-down');
      this.html.classList.remove('is-scrolling-up');
    } else {
      this.html.classList.remove('is-scrolling-down');
      this.html.classList.add('is-scrolling-up');
    }
  }
/** Permet de faire aparaître le menu en version mobile */
  initNavMobile() {
    const toggle = this.element.querySelector('.js-toggle');

    toggle.addEventListener('click', this.onToggleNav.bind(this));
  }
 /** Ajoute la class 'nav-is-active' dans la page html */
  onToggleNav() {
    this.html.classList.toggle('nav-is-active');
  }
}
