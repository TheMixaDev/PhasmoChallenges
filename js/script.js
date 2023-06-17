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
const RequirementType = {
    MULTIPLAYER: 1,
    DISCORD: 2,
    HARDMODE: 3
}
let Flags = []
const _v = ()=>{};
class Card {
    constructor(name, stacks, beforeFinish, requirement) {
        this.name = name;
        this.stacks = stacks == undefined ? [] : stacks;
        this.beforeFinish = beforeFinish == undefined ? false : beforeFinish;
        this.requirement = requirement == undefined ? [] : requirement;
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
    checkFlags() {
        for(let flag of this.requirement)
            if(!Flags.includes(flag)) return false;
        return true;
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
        if(card == null) // lock mechanism
            return true;
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
    static fromSingleCard(card) {
        let tempDeck = new CardDeck();
        tempDeck.addCard(card);
        return tempDeck;
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
        let card = pickCard(deck, Cards);
        deck.cards.splice(index, 1);
        deck.addCard(card);
        return deck;
    }, [RequirementType.MULTIPLAYER]),
    new Card("Сбрасывать все вещи в начале охоты", [StackType.SPECIAL.PHOTO, StackType.SPECIAL.FLASHLIGHT]),
    
    new Card("Активация по голосу", [StackType.VOICE]),
    new Card("Орать во время охоты", [StackType.VOICE, StackType.SPECIAL.SCREAM]),
    new Card("{NUM} слов на всю игру", [StackType.VOICE], (decks, deck, index)=>{
        deck.cards[index].name = deck.cards[index].name.replace("{NUM}", random.number(1,15));
        return deck;
    }, [RequirementType.MULTIPLAYER]),
    new Card("Молчать всю игру", [StackType.VOICE], false, [RequirementType.MULTIPLAYER]),
    new Card("3 слова в минуту", [StackType.VOICE], false, [RequirementType.MULTIPLAYER]),
    new Card("Soundpad", [StackType.VOICE], false, [RequirementType.MULTIPLAYER, RequirementType.DISCORD]),

    new Card("Жить в \"ареале обитания\" призрака после его нахождения", [StackType.MOVEMENT]),
    new Card("Идти фотографировать призрака во время охоты", [StackType.MOVEMENT, StackType.SPECIAL.PHOTO]),
    new Card("АФК во время охоты", [StackType.MOVEMENT]),
    new Card("Не пользоваться укрытиями", [StackType.MOVEMENT]),
    new Card("30 секунд в каждой комнате", [StackType.MOVEMENT]),
    new Card("Не открывать двери", [StackType.MOVEMENT]),
    new Card("\"Романтический ужин\"", [StackType.MOVEMENT]),

    new Card("Освещать путь только зажигалкой", [StackType.LIGHT]),
    new Card("Ходить с включенной электроникой во время охоты", [StackType.LIGHT, StackType.SPECIAL.FLASHLIGHT]),
    new Card("Без фонариков и камеры", [StackType.LIGHT]),

    new Card("Играть с 2 слотами (неизменяемые)", [StackType.ITEMS]),
    new Card("1 слот (изменяемый)", [StackType.ITEMS]),
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
    new Card("Без улик"),
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

            DOUBLE: 15,

            HARDMODE_CARD: 50
        },
        SWAP: 5,
        VOICE_8BIT: 10,
        ARRAY: ["Палатки", "Дома 6 и 42", "Дома 10 и 13", "Фермерские дома", "Школа и тюрьма", "Sunny Meadows"]
    }
}

function pickCard(deck, cards) {
    for(let i = 0; i < 1000; i++) { // Try to pick a card 1000 times
        let card = random.arrayElement(cards);
        if(!deck.isStackable(card) || !card.checkFlags())
            continue;
        return card;
    }
    console.log("Wow - Unable to pick a card in 1000 attempts");
    return null;
}

function generatePlayerDeck() {
    let deck = new CardDeck();
    let i = random.percentage(Chances.PLAYER.DOUBLE) ? (
        random.percentage(Chances.PLAYER.TRIPLE) ? (
            random.percentage(Chances.PLAYER.QUAD) ? 4 : 3
        ) : 2
    ) : 1;
    if(Flags.includes(RequirementType.HARDMODE))
        i++;
    while(i > 0) {
        if(deck.addCard(pickCard(deck, Cards)))
            i--;
    }
    return deck;
}

function generateMapDeck(playerDecks) {
    let deck = new CardDeck();
    let diff = random.percentage(Chances.MAP.DIFF.PROFESSIONAL / (Flags.includes(RequirementType.HARDMODE) ? 2 : 1)) ? Diffs.PROFESSIONAL :
    (random.percentage(Chances.MAP.DIFF.NIGHTMARE / (Flags.includes(RequirementType.HARDMODE) ? 1.3 : 1)) ? Diffs.NIGHTMARE : 
    (random.percentage(Chances.MAP.DIFF.MADNESS * (Flags.includes(RequirementType.HARDMODE) ? 1.2 : 1)) ? Diffs.MADNESS : Diffs.RANDOM));
    if(Flags.includes(RequirementType.DISCORD) && random.percentage(Chances.MAP.VOICE_8BIT * (Flags.includes(RequirementType.HARDMODE) ? 1.5 : 1)))
        deck.addCard(new Card("8-бит"));
    let i = 0;
    if(diff != Diffs.RANDOM) {
        if(random.percentage(Chances.MAP.MODIFY[diff] * (Flags.includes(RequirementType.HARDMODE) ? 1.2 : 1)))
            i = random.percentage(Chances.MAP.MODIFY.DOUBLE) ? 2 : 1;
        if(Flags.includes(RequirementType.HARDMODE) && random.percentage(Chances.MAP.MODIFY.HARDMODE_CARD))
            i++;
    }
    while(i > 0) {
        if(deck.addCard(pickCard(deck, MapCards)))
            i--;
    }
    if(Flags.includes(RequirementType.MULTIPLAYER) && random.percentage(Chances.MAP.SWAP)) {
        if(random.percentage(50)) {
            deck.addCard(new Card(`Игрок ${random.number(1,needCards)} выбирает с кем поменять свои челленджи.`));
        } else {
            let player = random.number(1,needCards);
            let card = pickCard(playerDecks[player-1], Cards);
            if(card != null) {
                let tempDeck = CardDeck.fromSingleCard(card);
                tempDeck = CardDeck.finish([tempDeck], tempDeck);
                deck.addCard(new Card(`Игрок ${player} может добавить любой челлендж игроку, и получить "${tempDeck.cards[0].name}"`));
            }
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