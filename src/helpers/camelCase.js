export const camelCase = (str) => {
    if (str !== undefined && str !== null){
        str = str.replace("_", " ");
        const words = str.split(" ");
        for (let i = 0; i < words.length; i++) {
            if(words[i]!==""){
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }
        }
        
        return words.join(" ");
    }
}