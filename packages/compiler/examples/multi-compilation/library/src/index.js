class Service {
    constructor(url) {
        this.url = url;
    }

    getData() {
        return fetch(this.url);
    }
}

module.exports = Service;
