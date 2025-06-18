
export class authServiceRevision {

    genereOpt(lenght: number = 8): string {

        let codeOpt = "";
        for(let i=0; i<lenght; i++) {
            // Generate a random digit between 0 and 9    
            codeOpt += Math.floor(Math.random() * 10);
        }
        return codeOpt;
    }

    
}