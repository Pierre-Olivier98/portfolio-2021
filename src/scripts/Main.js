import ComponentFactory from './ComponentFactory';
import Icons from './utilities/Icons';

class Main {
  constructor() {
    this.init();
  }

  init() {
    document.documentElement.classList.add('has-js');

    new ComponentFactory();
  }
}

new Main();