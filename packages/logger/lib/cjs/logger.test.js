"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var limited_array_1 = __importDefault(require("limited-array"));
var logger_1 = require("./logger");
var logger;
var stackCollection;
beforeAll(function () {
    logger = new logger_1.Logger();
    stackCollection = new limited_array_1["default"]();
    logger.setUp({
        active: true,
        stackCollection: stackCollection
    });
});
describe('Test active logger', function () {
    ['log', 'info', 'debug', 'warn', 'error'].forEach(function (logMethod, index) {
        it("Logger test " + logMethod + " method", function () {
            var _a;
            logger[logMethod]("test " + logMethod + " method");
            var logItem = stackCollection.getData()[index];
            expect(Object.keys(logItem)[0])
                .toBe(logMethod);
            expect(logItem)
                .toStrictEqual((_a = {}, _a[logMethod] = "test " + logMethod + " method", _a));
        });
    });
});
describe('Test no-active logger', function () {
    it('Logger test all methods', function () {
        logger.setUp({
            active: false
        });
        var stackLengthBefore = stackCollection.getData().length;
        ['log', 'info', 'debug', 'warn', 'error'].forEach(function (logMethod) {
            logger[logMethod]("test " + logMethod + " method");
        });
        var stackLengthAfter = stackCollection.getData().length;
        expect(stackLengthBefore)
            .toBe(stackLengthAfter);
    });
});
