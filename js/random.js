const random = {
    percentage: (chance) => {
        return Math.random()*100 < chance;
    },
    arrayElement: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },
    shuffle: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    number: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}