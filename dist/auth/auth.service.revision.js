"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceRevision = void 0;
class authServiceRevision {
    genereOpt(lenght = 8) {
        let codeOpt = "";
        for (let i = 0; i < lenght; i++) {
            codeOpt += Math.floor(Math.random() * 10);
        }
        return codeOpt;
    }
}
exports.authServiceRevision = authServiceRevision;
//# sourceMappingURL=auth.service.revision.js.map