import Jed from 'jed';

let instance = null;

class I18N {
    constructor() {
        if (instance) {
            return instance;
        }
        this.jed = new Jed({ domain: 'messages' });
    }

    getJed() {
        return this.jed;
    }
}
const i18n = new I18N();

export default i18n;
