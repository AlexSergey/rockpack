// ./lib/index.js

/**
 * Displays a string in the console
 *
 * @param {string_to_say} String string to show in the console
 */
var say = function(string_to_say) {
    return console.log(string_to_say);
};

// Allows us to call this function from outside of the library file.
// Without this, the function would be private to this file.
exports.say = say;
