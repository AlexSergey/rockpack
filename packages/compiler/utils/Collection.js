const deepExtend = require('deep-extend');
const { isFunction, isObject, isArray } = require('valid-types');

class Collection {
    constructor(opt) {
        this._data = opt.data;
        this._props = opt.props;
        this.__tempData = {};

        this.dict = Object.keys(this._data)
            .reduce((dict, plName) => {
                if (isFunction(this._data[plName])) {
                    let d = this._data[plName](this._props[plName]);

                    if (isArray(d)) {
                        d.forEach((_d, index) => {
                            this.__tempData[`${plName}${index}`] = _d;
                        });
                    }
                    else {
                        dict[plName] = d;
                    }

                }
                else if (isObject(this._data[plName])) {
                    dict[plName] = deepExtend(this._data[plName], this._props[plName]);
                }
                return dict;
            }, {});

        for (let key in this.__tempData) {
            if (this.__tempData[key]) {
                this.dict[key] = this.__tempData[key];
            }
        }
    }

    get(name) {
        if (name) {
            return [this.dict[name]];
        }

        return Object.keys(this.dict)
            .map(name => this.dict[name]);
    }

    set(name, data) {
        this.dict[name] = data;
    }

    remove(name) {
        if (isArray(name)) {
            name.forEach(n => {
                this.dict[n] = null;
                delete this.dict[n];
            });
            return false;
        }
        this.dict[name] = null;
        delete this.dict[name];
    }

    add(name, instance) {
        this.dict[name] = instance;
    }
}

module.exports = Collection;