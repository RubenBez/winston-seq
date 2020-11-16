'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var winston_1 = require("winston");
winston_1.default.add(new index_1.default({
    apiKey: 'cxl5BEMudau8l2ZbGXDA',
    serverUrl: 'http://localhost:5341'
}));
winston_1.default.debug('Hello');
//# sourceMappingURL=test.js.map