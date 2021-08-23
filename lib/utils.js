"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.analyseTxData = void 0;
var ethers_1 = require("ethers");
// Analyse transaction arguments, and recursively check if an argument is
// an encoded function call
var analyseTxData = function (raw, knownInterfaces) {
    var args;
    var funcFragment;
    var found = false;
    for (var _i = 0, knownInterfaces_1 = knownInterfaces; _i < knownInterfaces_1.length; _i++) {
        var i = knownInterfaces_1[_i];
        // try to decode an encoded function call
        try {
            // decode arguments into array
            args = i.decodeFunctionData(ethers_1.ethers.utils.hexDataSlice(raw, 0, 4), raw);
            // get ethersjs function fragment (name and inputs types)
            funcFragment = i.getFunction(ethers_1.ethers.utils.hexDataSlice(raw, 0, 4));
            found = true;
            break;
        }
        catch (error) {
            // try another interface
            continue;
        }
    }
    if (!found) {
        // not an encoded function call, return the argument
        return { raw: raw };
    }
    // inject the type of each argument object into parsedArgs
    var parsedArgs = args.map(function (argCall, i) {
        return __assign(__assign({}, exports.analyseTxData(argCall, knownInterfaces)), { type: funcFragment.inputs[i].type, name: funcFragment.inputs[i].name });
    });
    return { funcFragment: funcFragment, parsedArgs: parsedArgs, raw: raw };
};
exports.analyseTxData = analyseTxData;
