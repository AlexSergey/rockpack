const deepExtend = require('deep-extend');
const { isFunction, isObject, isArray } = require('valid-types');

class Collection {
  constructor(opt) {
    this._data = opt.data;
    this._props = opt.props;
    this.__tempData = {};

    this.dict = Object.keys(this._data).reduce((dict, plName) => {
      if (isFunction(this._data[plName])) {
        const d = this._data[plName](this._props[plName]);

        if (isArray(d)) {
          d.forEach((_d, index) => {
            this.__tempData[`${plName}${index}`] = _d;
          });
        } else {
          dict[plName] = d;
        }
      } else if (isObject(this._data[plName])) {
        dict[plName] = deepExtend(this._data[plName], this._props[plName]);
      }

      return dict;
    }, {});

    Object.keys(this.__tempData).forEach((key) => {
      this.dict[key] = this.__tempData[key];
    });
  }

  get(name) {
    if (name) {
      return [this.dict[name]];
    }

    return Object.keys(this.dict).map((n) => this.dict[n]);
  }

  set(name, data) {
    this.dict[name] = data;
  }

  modify(name, cb) {
    if (!this.dict[name]) {
      throw new Error(`Provided name "${name}" was not found in the collection`);
    }
    if (!isFunction(cb)) {
      throw new Error('The second argument should be a function');
    }
    cb(this.dict[name]);
  }

  // eslint-disable-next-line consistent-return
  remove(name) {
    if (isArray(name)) {
      name.forEach((n) => {
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
