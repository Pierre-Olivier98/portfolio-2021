/** Composante Video de TimTools */
export default class Video {
    /**
     * Méthode constructeur
     * @param {HTMLElement} element - Élément HTML sur lequel la composante est instanciée
     */
    constructor(element) {
      this.element = element;
  
      this.videoContainer = this.element.querySelector('.js-video'); // permet d'aller chercher la vidéo
      this.poster = this.element.querySelector('.js-poster'); // permet d'aller chercher l'image
      this.videoId = this.element.dataset.videoId; // Chercher le Id du vidéo
      this.autoplay = this.poster ? 1 : 0; // Variable global qui retourne 0 ou 1 en présence ou non d'un poster image
      this.playerReady = false; // Indique que la vidéo n'est pas prêt
  
      Video.instances.push(this); // Permet de pousser l'instance de la classe Video dans le tableau
  
      if (this.videoId) {
        Video.loadScript(); // Démarer le chargement de libraire externe
      } else {
        console.error('Spécifier le Id');
      }
    }
  
    // Charge notre script
    static loadScript() {
      if (!Video.scriptIsLoading) {
        // Si la vidéo ne charge pas
        Video.scriptIsLoading = true; // La vidéo est en train de charger
  
        const script = document.createElement('script'); // Créer une balise script
        script.src = 'https://www.youtube.com/iframe_api'; // Changer la source du script
        document.body.appendChild(script); // Insérer le script dans le body
      }
    }
  
    /**
     * Méthode d'initialisation
     */
    init() {
      this.initPlayer = this.initPlayer.bind(this); // Redéfinir la variable par une copie virtuelle
  
      // Si on s un poster, on rajoute un écouteur sur l'élément Player, sinon on l'appelle directement le player
      if (this.poster) {
        this.element.addEventListener('click', this.initPlayer.bind(this));
      } else {
        this.initPlayer();
      }
    }
  
    initPlayer(event) {
      if (event) {
        this.element.removeEventListener('click', this.initPlayer); // Permet d'enlever le click après que la vidéo joue
      }
      
  
      this.player = new YT.Player(this.videoContainer, {
        height: '100%',
        width: '100%',
        videoId: this.videoId,
        playerVars: { rel: 1, autoplay: this.autoplay, loop: 1, playlist: this.videoId,}, 
        events: {
          onReady: () => {
            const observer = new IntersectionObserver(this.watch.bind(this), {
              rootMargin: '0px 0px 0px 0px',
            });
            observer.observe(this.element);
          },
          onStateChange: (event) => {
            this.playerReady = true; // Le player est prêt
            if (event.data == YT.PlayerState.PLAYING) {
              // pause toutes les vidéos sauf celui qui joue
              Video.pauseAll(this);
            } else if (event.data == YT.PlayerState.ENDED) {
              // Si  la vidéo est terminée
              this.player.seekTo(0); // Remet la vidéo au début
              this.player.pauseVideo(); // Mets la vidéo sur pause
            }
          },
        },
      }); // Méthode pour instencier le lecteur et chercher plusieurs éléments
    }
  
    // tableau qui va contenir tous les éléments de que l'observer va observer
    watch(entries) {
      if (this.playerReady && !entries[0].isIntersecting) {
        // Si le le lecteur existe et qu'il n'est pas dans mon viewport
        this.player.pauseVideo(); // Dire au player d'arrêter la vidéo
      }
      console.log(this.player);
    }
  
    // Tableau qui permet de faire une boucle dans le tableau Video.instances
    static initAll() {
      document.documentElement.classList.add('is-video-ready'); // classe ajouté lorsque le script est charger
  
      for (let i = 0; i < Video.instances.length; i++) {
        const instance = Video.instances[i];
        instance.init();
      }
      
    }

    
  
    // Permet de faire pause aux vidéos
    static pauseAll(currentInstance) {
      document.documentElement.classList.add('is-video-ready'); // classe ajouté lorsque le script est charger
  
      for (let i = 0; i < Video.instances.length; i++) {
        const instance = Video.instances[i];
        if (instance.playerReady && instance != currentInstance) {
          // Si le player est présent sur l'instance et qu'elle est différente que celle de la boucle
          instance.player.pauseVideo(); // Mets pause à la vidéo
        }
      }
      
    }
    
  }
  
  Video.instances = []; // Création d'un tableau
  window.onYouTubeIframeAPIReady = Video.initAll; // Permet de boucler dans les éléments du tableau pour le init