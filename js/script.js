const StackType = {
    ANY: 0,
    VOICE: 1,
    MOVEMENT: 2,
    LIGHT: 3,
    ITEMS: 4,

    SPECIAL: {
        PHOTO: 900,
        SCREAM: 901,
        FLASHLIGHT: 902
    },
}
const _v = ()=>{};
class Card {
    constructor(name, stacks, beforeFinish) {
        this.name = name;
        this.stacks = stacks == undefined ? [] : stacks;
        this.beforeFinish = beforeFinish == undefined ? false : beforeFinish;
    }
    isStackable(card) {
        if(card.name == this.name)
            return false;
        for(let stack of card.stacks) {
            if(this.stacks.includes(stack))
                return false;
        }
        return true;
    }
    finish(decks, deck, index) {
        if(this.beforeFinish)
            return this.beforeFinish(decks, deck, index);
        return deck;
    }
    clone() {
        return new Card(this.name, this.stacks, this.beforeFinish);
    }
}
class CardDeck {
    constructor() {
        this.cards = [];
    }
    isStackable(newCard) {
        for(let card of this.cards) {
            if(!card.isStackable(newCard))
                return false;
        }
        return true;
    }
    addCard(card) {
        if(!this.isStackable(card))
            return false;
        this.cards.push(card.clone());
        return true;
    }
    stringify() {
        let result = "";
        for(let i of this.cards)
            result += i.name+"<br>";
        return result;
    }
    static finish(decks, deck) {
        for(let i = 0; i < deck.cards.length; i++)
            deck = deck.cards[i].finish(decks, deck, i);
        return deck;
    }
}
const Cards = [
    new Card("Не пользоваться благовонием"),
    new Card("Орущий следует за вами", [StackType.SPECIAL.SCREAM], (decks, deck, index)=>{
        for(let i of decks) {
            for(let j of i.cards) {
                if(j.stacks.includes(StackType.SPECIAL.SCREAM) && j.name != deck.cards[index].name)
                    return deck;
            }
        }
        let name = deck.cards[index].name;
        deck.cards.splice(index, 1);
        while(true) {
            let card = random.arrayElement(Cards);
            if(!deck.isStackable(card))
                continue;
            if(card.name == name)
                continue;
            deck.cards.push(card.clone());
            return deck;
        }
    }),
    new Card("Сбрасывать все вещи в начале охоты", [StackType.SPECIAL.PHOTO, StackType.SPECIAL.FLASHLIGHT]),
    
    new Card("Активация по голосу", [StackType.VOICE]),
    new Card("Орать во время охоты", [StackType.VOICE, StackType.SPECIAL.SCREAM]),
    new Card("{NUM} слов на всю игру", [StackType.VOICE], (decks, deck, index)=>{
        deck.cards[index].name = deck.cards[index].name.replace("{NUM}", random.number(1,15));
        return deck;
    }),
    new Card("Молчать всю игру", [StackType.VOICE]),
    new Card("3 слова в минуту", [StackType.VOICE]),
    new Card("Soundpad", [StackType.VOICE]),

    new Card("Жить в \"ареале обитания\" призрака после его нахождения", [StackType.MOVEMENT]),
    new Card("Идти фотографировать призрака во время охоты", [StackType.MOVEMENT, StackType.SPECIAL.PHOTO]),
    new Card("АФК во время охоты", [StackType.MOVEMENT]),
    new Card("Не пользоваться укрытиями", [StackType.MOVEMENT]),
    new Card("Минута в каждой входимой комнате", [StackType.MOVEMENT]),
    new Card("Не открывать двери", [StackType.MOVEMENT]),
    new Card("\"Романтический ужин\"", [StackType.MOVEMENT]),

    new Card("Освещать путь только зажигалкой", [StackType.LIGHT]),
    new Card("Ходить с включенной электроникой во время охоты", [StackType.LIGHT, StackType.SPECIAL.FLASHLIGHT]),
    new Card("Без фонариков и камеры", [StackType.LIGHT]),

    new Card("Играть с 2 слотами (без свапа)", [StackType.ITEMS]),
    new Card("1 слот (свапаемый)", [StackType.ITEMS]),
    new Card("\"Фотограф\"", [StackType.ITEMS]),
    new Card("Симулятор вора", [StackType.ITEMS]),
]
const MapCards = [
    new Card("{WEATHER}", [], (decks, deck, index)=>{
        deck.cards[index].name = "Погода: "+random.arrayElement(["Туман", "Ливень", "Снег"]);
        return deck;
    }),
    new Card("Без бега"),
    new Card("0 рассудка+таблетки"),
    new Card("0 безопасный период"),
    new Card("150% призрак"),
    new Card("75% игроки"),
    new Card("0 улик"),
    new Card("Сломанный рубильник"),
    new Card("Без закупа", [StackType.ITEMS]),
    new Card("Без распятий", [StackType.ITEMS]),
]
const Diffs = {
    PROFESSIONAL: "PROFESSIONAL",
    NIGHTMARE: "NIGHTMARE",
    MADNESS: "MADNESS",
    RANDOM: "RANDOM"
}
const DiffsTranslate = {
    PROFESSIONAL: "ПРОФЕССИОНАЛ",
    NIGHTMARE: "КОШМАР",
    MADNESS: "БЕЗУМИЕ",
    RANDOM: "АБСОЛЮТНО СЛУЧАЙНАЯ"
}
const Chances = {
    PLAYER: {
        DOUBLE: 25,
        TRIPLE: 35,
        QUAD: 15
    },
    MAP: {
        DIFF: {
            PROFESSIONAL: 65,
            NIGHTMARE: 90,
            MADNESS: 50 // else - RANDOM
        },
        MODIFY: {
            PROFESSIONAL: 90,
            NIGHTMARE: 60,
            MADNESS: 10,

            DOUBLE: 15
        },
        SWAP: 5,
        VOICE_8BIT: 10,
        ARRAY: ["Палатки", "Дома 6 и 42", "Дома 10 и 13", "Фермерские дома", "Школа и тюрьма", "Sunny Meadows"]
    }
}

function generatePlayerDeck() {
    let deck = new CardDeck();
    let i = random.percentage(Chances.PLAYER.DOUBLE) ? (
        random.percentage(Chances.PLAYER.TRIPLE) ? (
            random.percentage(Chances.PLAYER.QUAD) ? 4 : 3
        ) : 2
    ) : 1;
    while(i > 0) {
        if(deck.addCard(random.arrayElement(Cards)))
            i--;
    }
    return deck;
}

function generateMapDeck(playerDecks) {
    let deck = new CardDeck();
    let diff = random.percentage(Chances.MAP.DIFF.PROFESSIONAL) ? Diffs.PROFESSIONAL :
    (random.percentage(Chances.MAP.DIFF.NIGHTMARE) ? Diffs.NIGHTMARE : 
    (random.percentage(Chances.MAP.DIFF.MADNESS) ? Diffs.MADNESS : Diffs.RANDOM));
    if(random.percentage(Chances.MAP.VOICE_8BIT))
        deck.addCard(new Card("8-бит"));
    if(diff != Diffs.RANDOM && random.percentage(Chances.MAP.MODIFY[diff])) {
        let i = random.percentage(Chances.MAP.MODIFY.DOUBLE) ? 2 : 1;
        while(i > 0) {
            if(deck.addCard(random.arrayElement(MapCards)))
                i--;
        }
    }
    if(needCards != 1 && random.percentage(Chances.MAP.SWAP)) {
        if(random.percentage(50)) {
            deck.addCard(new Card(`Игрок ${random.number(1,needCards)} выбирает с кем поменять свои челленджи.`));
        } else {
            let player = random.number(1,needCards);
            let card = random.arrayElement(Cards);
            while(!playerDecks[player-1].isStackable(card))
                card = random.arrayElement(Cards);
            let tempDeck = new CardDeck();
            tempDeck.cards.push(card.clone());
            tempDeck = CardDeck.finish([tempDeck], tempDeck);
            deck.addCard(new Card(`Игрок ${player} может добавить любой челлендж игроку, и получить "${tempDeck.cards[0].name}"`));
        }
    }
    deck = CardDeck.finish([deck], deck);
    return {
        DIFF: diff,
        DECK: deck,
        NAME: random.arrayElement(Chances.MAP.ARRAY)
    };
}

function generateFull(players) {
    let decks = [];
    for(let i = 0; i < players; i++)
        decks.push(generatePlayerDeck());
    let map = generateMapDeck(decks);
    for(let i = 0; i < decks.length; i++)
        decks[i] = CardDeck.finish(decks, decks[i]);
    return {
        PLAYERS: decks,
        MAP: map
    }
}