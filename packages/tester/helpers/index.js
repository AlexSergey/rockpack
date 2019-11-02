const enzyme = require('enzyme');
const enzymeToJson = require('enzyme-to-json');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({
    adapter: new Adapter()
});

module.exports = {
    enzyme,
    enzymeToJson
};
