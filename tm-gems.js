/*------------------------------------*\
        ____            _  __    
       / __"| u        |"|/ /    
      <\___ \/         | ' /     
       u___) |       U/| . \\u   
       |____/>>        |_|\_\    
        )(  (__)     ,-,>> \\,-. 
       (__)           \.)   (_/  

\*------------------------------------*/

import {
    LitElement,
    html,
    css
} from 'lit';
/**
 * TM24 GEMS
 * WEB COMPONENT
 */
export class TMGems extends LitElement {
    static get styles() {
        return css `
      :host,
      #tm-gems {
        display: block;
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        pointer-events:none;
        overflow:hidden;
        z-index:99;
      }
      #tm-gems img{
        position: absolute;
        width: 0px;
        height: auto;
        transform: translateX(-50%) translateY(-50%);
        transition: all 800ms cubic-bezier(0.06, 0.49, 0.02, 1.35);
        transition-property: width, height;
      }
      #tm-gems img.bling {
        transition: all 150ms cubic-bezier(0, 1.21, 0, 4.95);
        opacity: 0.9;
      }
    `;
    }

    static get properties() {
        return {
            pause: {
                attribute: false
            },
            distance: {
                type: Number,
                attribute: 'gem-distance',
            },
            maxGems: {
                type: Number,
                attribute: 'max-gems',
            },
            gemWidth: {
                type: Number,
                attribute: 'gem-min-width',
            },
            gemDifference: {
                type: Number,
                attribute: 'gem-difference',
            },
            gemDelay: {
                type: Number,
                attribute: 'gem-delay'
            },
            gemLife: {
                type: Number,
                attribute: 'gem-life'
            },
            assets: {
                attribute: false
            },
            _gems: {
                attribute: false,
                state: true
            },
            _sparkles: {
                attribute: false,
                state: true
            },
            _viewport: {
                attribute: false,
                state: true
            }
        };
    }

    constructor() {
        super();
        this.pause = false;
        this.distance = 1.2;
        this.maxGems = 45;
        this.gemWidth = 2;
        this.gemDifference = 0.5;
        this.gemDelay = 450;
        this.gemLife = 3000;
        this._gems = {
            active: false,
            asset: 0,
            distance: 0,
            size: 0,
            gems: [],
            quarry: []
        };
        this._viewport = {
            vw: 0,
            vh: 0,
            landscape: false
        }
        this.assets = {
            bling: "iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OTc3NywgMjAyMy8wNi8yNS0yMzo1NzoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTExLTA3VDE0OjE3OjI1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMS0wOVQxMTo1NToxOCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMS0wOVQxMTo1NToxOCswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQ4NmI0MzQtMmJlNy00YmVmLWIzYmYtMmVlZGFlNDY2NzM5IiB4bXBNTTpEb2N1bWVu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"
        }

        this._resize();

    }

    connectedCallback() {

        super.connectedCallback();
        document.addEventListener('pointerdown', this._startgems);
        document.addEventListener('pointerup', this._stopgems);
        window.addEventListener('resize', this._resize);

    }
    disconnectedCallback() {
        document.removeEventListener('pointerup', this._stopgems);
        document.removeEventListener('pointermove', this._drawgems);
        super.disconnectedCallback();
    }
    get scope() {
        return this.renderRoot?.querySelector('#tm-gems') ?? null;
    }

    _resize = () => {


        let vw = window.innerWidth;
        let vh = window.innerHeight;

        let ratio = vw / vh;

        this._viewport.vw = vw;
        this._viewport.vh = vh;

        if (ratio > 1.5) {

            this._viewport.landscape = true;

        } else {

            this._viewport.landscape = false;

        }

        this._gems.size = this._getGemSize(this.gemWidth);
        this._gems.distance = this._gems.size * this.distance;

    }

    _getGemSize(gDiff) {

        const gMin = 30;
        const gMax = 90;

        let d;

        if (this._viewport.landscape) {

            d = this._viewport.vw;

        } else {

            d = this._viewport.vh;

        }

        let gSize = Math.abs(Math.min(Math.max(d * gDiff / 100, gMin), gMax));

        return gSize;

    }




    _startgems = (e) => {

        this.pause = setTimeout(() => {

            this._gems.asset = this._random(0, this.assets.gems.length-1);
            this._gems.active = true;
            document.addEventListener('pointermove', this._drawgems);

        }, this.gemDelay)

    }

    _stopgems = (e) => {

        clearTimeout(this.pause);
        this._gems.active = false;
        document.removeEventListener('pointermove', this._drawgems);

    }

    _drawgems = (e) => {

        // CHECK FOR ADJACENT GEMS

        let comfort = this._comfortZone(e.clientX, e.clientY, this._gems.gems, this.distance);

        if (comfort) {

            // CREATE GEM ELEMENT

            let gem = document.createElement('img');
            gem.setAttribute('src', 'data:image/png;base64,' + this.assets.gems[this._gems.asset]);

            let gx = e.clientX / this._viewport.vw * 100;
            let gy = e.clientY / this._viewport.vh * 100;

            gem.style.left = gx + "%";
            gem.style.top = gy + "%";

            let gDiff = this._random(100 - 100 * this.gemDifference, 100 + 100 * this.gemDifference) / 100;

            let size = {
                x: e.clientX,
                y: e.clientY,
                el: gem,
            }

            // PUSH GEM ELEMENT

            this._gems.gems.push(size);

            this.scope.appendChild(gem);

            setTimeout(() => {

                gem.style.width = this._gems.size * gDiff + "px";

            }, 10);

            // DRAW BLING

            this._drawBling(e.clientX, e.clientY, this._gems.size * gDiff);

            if (this._gems.gems.length > this.maxGems) {

                this._gems.gems[0].el.style.width = "0px";
                this._gems.quarry.push(this._gems.gems[0]);
                this._gems.gems.splice(0, 1);

                setTimeout(() => {

                    this.scope.removeChild(this._gems.quarry[0].el);
                    this._gems.quarry.splice(0, 1);

                }, 800)

            }

            // SAY GOODBYE

            this._gemBye(gem);

        }

    }

    _drawBling(x, y, width) {

        let delay = 10;

        for (let i = 0; i <= 2; i++) {

            let bxA = this._random(x - this._gems.size * 0.5, x + this._gems.size * 0.5);
            let byA = this._random(y - this._gems.size * 0.5, y + this._gems.size * 0.5);

            let bx = bxA / this._viewport.vw * 100;
            let by = byA / this._viewport.vh * 100;

            let bw = this._random(width * 0.4, width * 0.8);

            let bling = document.createElement('img');
            bling.setAttribute('src', 'data:image/png;base64,' + this.assets.bling);
            bling.classList.add('bling');
            bling.style.left = bx + "%";
            bling.style.top = by + "%";

            setTimeout(() => {

                bling.style.width = bw + "px";

            }, (200 + delay) * i);

            this.scope.appendChild(bling);

            setTimeout(() => {

                this.scope.removeChild(bling);

            }, (200 + delay + 150) * i)

        }

    }

    _gemBye(gem) {

        setTimeout(() => {

            if (this._gems.gems.length) {

                this._gems.gems[0].el.style.width = "0px";
                this._gems.quarry.push(this._gems.gems[0]);
                this._gems.gems.splice(0, 1);

                setTimeout(() => {

                    this.scope.removeChild(this._gems.quarry[0].el);
                    this._gems.quarry.splice(0, 1);

                }, 800)

            }

        }, this.gemLife)

    }

    _comfortZone(x, y, gems) {

        let comfort = true;

        gems.forEach(gem => {

            if (Math.abs(gem.x - x) <= this._gems.distance && Math.abs(gem.y - y) <= this._gems.distance) {

                comfort = false;

            }

        })

        return comfort;

    }

    _random(min, max) {
        max = Math.floor(max) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    render() {
        return html `
    <section id="tm-gems"></section>
`;
    }
}

window.customElements.define('tm-gems', TMGems);