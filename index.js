const media = Symbol('media');
const query = Symbol('query');
const listener = Symbol('listener');
const handleMediaChange = Symbol('handleMediaChange');
const capture = Symbol('capture');
const restore = Symbol('restore');
const elements = Symbol('elements');
const match = Symbol('elements');

class MQPortal extends HTMLElement {
    constructor(...args) {
        super(...args)
        this[listener] = () => this[handleMediaChange]();
        this[query] = null;
        this[media] = null;
        this[elements] = new WeakMap();
        this[match] = null;
    }

    static get observedAttributes() {
        return ['media', 'match'];
    }

    attributeChangedCallback(attr, _oldVal, newVal) {
        this[attr] = newVal;
    }

    set media(v) {
        if (this[query]) {
            this[query].removeListener(this[listener]);
            this[query] = null;
        }

        this[media] = v;

        if (this[media]) {
            this[query] = window.matchMedia(this[media]);
            this[query].addListener(this[listener]);
        }
        this[handleMediaChange]();
    }

    get media() {
        return this[media];
    }

    get match() {
        return this[match];
    }

    set match(m) {
        this[match] = m;
        this[handleMediaChange]();
    }

    [capture]() {
        console.warn('capture');
        if (this.children.length > 0) this[restore]();
        const frag = document.createDocumentFragment();
        for (const el of document.querySelectorAll(this[match])) {
            this[elements].set(el, { parentNode: el.parentNode, nextSibling: el.nextSibling  || null });
            frag.appendChild(el);
        }
        this.appendChild(frag);
    }

    [restore]() {
        console.warn('restore');
        for (const el of Array.from(this.children).reverse()) {
            const ref = this[elements].get(el);
            if (!ref) {
                console.warn('found unknown element', el);
                continue;
            }
            ref.parentNode.insertBefore(el, ref.nextSibling);
        }
    }

    [handleMediaChange]() {
        console.warn('media change');
        if (this[query] && this[query].matches && this[match]) {
            this[capture]();
        } else {
            this[restore]();
        }
    }
}

window.customElements.define('mq-portal', MQPortal);
