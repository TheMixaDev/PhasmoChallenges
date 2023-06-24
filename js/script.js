const StackType = {
    ANY: 0,
    VOICE: 1,
    MOVEMENT: 2,
    LIGHT: 3,
    ITEMS: 4,

    SPECIAL: {
        PHOTO: 900,
        SCREAM: 901,
        FLASHLIGHT: 902,
        AREAL: 903
    },
};
const RequirementType = {
    MULTIPLAYER: 1,
    DISCORD: 2,
    HARDMODE: 3,
    VOICE: 4
};
let Flags = [];
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
    new Card(getLang("CARD_NO_SMUDGESTICK")),
    new Card(getLang("CARD_SCREAMER_FOLLOW"), [StackType.SPECIAL.SCREAM], (decks, deck, index)=>{
        for(let i of decks) {
            for(let j of i.cards) {
                if(j.stacks.includes(StackType.SPECIAL.SCREAM) && j.name != deck.cards[index].name)
                    return deck;
            }
        }
        let card = pickCard(deck, Cards);
        deck.cards.splice(index, 1);
        deck.addCard(card);
        deck = card.finish(decks, deck, deck.cards.length-1);
        return deck;
    }, [RequirementType.MULTIPLAYER]),
    new Card(getLang("CARD_ITEM_DROP"), [StackType.SPECIAL.PHOTO, StackType.SPECIAL.FLASHLIGHT]),
    
    new Card(getLang("CARD_VOICE_ACTIVATION"), [StackType.VOICE], false, [RequirementType.VOICE]),
    new Card(getLang("CARD_SCREAMER"), [StackType.VOICE, StackType.SPECIAL.SCREAM]),
    new Card(getLang("CARD_VOICE_LIMITER"), [StackType.VOICE], (decks, deck, index)=>{
        deck.cards[index].name = deck.cards[index].name.replace("{NUM}", random.number(1,15) + (Flags.includes(RequirementType.HARDMODE) ? 0 : 10));
        return deck;
    }, [RequirementType.MULTIPLAYER, RequirementType.VOICE]),
    new Card(getLang("CARD_SILENCE"), [StackType.VOICE], false, [RequirementType.MULTIPLAYER, RequirementType.HARDMODE, RequirementType.VOICE]),
    new Card(getLang("CARD_WORD_PER_MINUTE"), [StackType.VOICE], (decks, deck, index)=>{
        deck.cards[index].name = deck.cards[index].name.replace("{NUM}", Flags.includes(RequirementType.HARDMODE) ? random.number(1,3) : 3);
        return deck;
    }, [RequirementType.MULTIPLAYER, RequirementType.VOICE]),
    new Card(getLang("CARD_SOUNDPAD"), [StackType.VOICE], false, [RequirementType.MULTIPLAYER, RequirementType.DISCORD, RequirementType.VOICE]),

    new Card(getLang("CARD_GHOSTMATE"), [StackType.MOVEMENT, StackType.SPECIAL.AREAL], false, [RequirementType.HARDMODE]),
    new Card(getLang("CARD_PHOTO_HUNT"), [StackType.MOVEMENT, StackType.SPECIAL.PHOTO]),
    new Card(getLang("CARD_AFK_HUNT"), [StackType.MOVEMENT]),
    new Card(getLang("CARD_NO_HIDING"), [StackType.MOVEMENT]),
    new Card(getLang("CARD_AFK_ROOM"), [StackType.MOVEMENT]),
    new Card(getLang("CARD_NO_DOORS"), [StackType.MOVEMENT]),
    new Card(getLang("CARD_ROMANTIC_DINNER"), [StackType.MOVEMENT]),

    new Card(getLang("CARD_LIGHTER"), [StackType.LIGHT], false, [RequirementType.HARDMODE]),
    new Card(getLang("CARD_ELECTRONIC"), [StackType.LIGHT, StackType.SPECIAL.FLASHLIGHT]),
    new Card(getLang("CARD_NO_LIGHT"), [StackType.LIGHT]),

    new Card(getLang("CARD_2_SLOTS"), [StackType.ITEMS]),
    new Card(getLang("CARD_1_SLOT"), [StackType.ITEMS]),
    new Card(getLang("CARD_PHOTO"), [StackType.ITEMS, StackType.SPECIAL.AREAL]),
    new Card(getLang("CARD_THIEF"), [StackType.ITEMS, StackType.SPECIAL.AREAL]),
]
const MapCards = [
    new Card("{WEATHER}", [], (decks, deck, index)=>{
        deck.cards[index].name = getLang("MAPCARD_WEATHER_LABEL")+random.arrayElement([
            getLang("MAPCARD_WEATHER_FOG"),
            getLang("MAPCARD_WEATHER_RAIN"),
            getLang("MAPCARD_WEATHER_SNOW")
        ]);
        return deck;
    }),
    new Card(getLang("MAPCARD_NO_RUNNING")),
    new Card(getLang("MAPCARD_NO_SANITY")),
    new Card(getLang("MAPCARD_NO_GRACE")),
    new Card(getLang("MAPCARD_FAST_GHOST")),
    new Card(getLang("MAPCARD_SLOW_PLAYER")),
    new Card(getLang("MAPCARD_NO_EVIDENCE")),
    new Card(getLang("MAPCARD_NO_BREAKER")),
    new Card(getLang("MAPCARD_STARTER_ITEMS"), [StackType.ITEMS]),
    new Card(getLang("MAPCARD_NO_CRUCIFIX"), [StackType.ITEMS]),
]
const Diffs = {
    PROFESSIONAL: "PROFESSIONAL",
    NIGHTMARE: "NIGHTMARE",
    MADNESS: "MADNESS",
    RANDOM: "RANDOM"
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
        ARRAY: getLang("MAP_ARRAY")
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
        deck.addCard(new Card(getLang("MAPCARD_8BIT")));
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
            deck.addCard(new Card(getLang("CUSTOM_SWAP").replace("{PLAYER}", random.number(1,needCards))));
        } else {
            let player = random.number(1,needCards);
            let card = pickCard(playerDecks[player-1], Cards);
            if(card != null) {
                let tempDeck = CardDeck.fromSingleCard(card);
                tempDeck = CardDeck.finish([tempDeck], tempDeck);
                deck.addCard(new Card(getLang("CUSTOM_SWAP").replace("{PLAYER}", player).replace("{CARD}", tempDeck.cards[0].name)));
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