let data = null;
let lastIndex = -1;
let showedCards = 0;
let needCards = 4;
let mapShown = false;
let animationTimeout = -1;
let menuActive = false;

let options = getOptions();

function oninit() {
    Lib.BubblyButton();
    Lib.AnimatedCards();

    // apply options
    e("discordCheckbox").checked = options.discord ? true : false;
    e("hardmodeCheckbox").checked = options.hardmode ? true : false;
}
function getOptions() {
    if(localStorage.getItem("options") == null) {
        let options = {
            discord: true,
            hardmode: false,
        };
        localStorage.setItem("options", JSON.stringify(options))
    }
    return JSON.parse(localStorage.getItem("options"));
}
function saveOptions() {
    localStorage.setItem("options", JSON.stringify(options))
}
function toggleOption(option) {
    options[option] = !options[option];
    saveOptions();
}
function generate(players) {
    if(options.hardmode)
        Flags.push(RequirementType.HARDMODE);
    if(players > 1) {
        Flags.push(RequirementType.MULTIPLAYER);
        if(options.discord)
            Flags.push(RequirementType.DISCORD);
    }
    data = generateFull(players);
    needCards = players;
    console.log(data);
    let removeIndexes = [1,2,3,4];
    for(let i = 0; i < players; i++)
        removeIndexes[i] = 0;
    for(let i of removeIndexes) {
        if(i != 0)
            e("card"+i).remove();
    }
    e("playerCard").style.cssText = "display: flex;";
    setTimeout(()=>{
        e("playerCard").style.opacity = 1;
    },300);
    e("menu").style.opacity = 0;
    setTimeout(()=>{
        e("menu").style.display = "none";
        e("starter").style.display = "none";
    },300);
}
function e(id) {
    return document.getElementById(id);
}
function unhide(index) {
    if(animationTimeout > -1) {
        clearInterval(animationTimeout);
        animationTimeout = -1;
        showedCards++;
        nextAction();
        if(index == lastIndex) return;
    }
    let id = "card"+index;
    if(!e(id).getAttribute("class").includes("unknown"))
        return;
    lastIndex = index;
    let amount = data.PLAYERS[index-1].cards.length;
    let rarity = "special";
    if(amount == 3) rarity = "legendary";
    if(amount == 2) rarity = "rare";
    if(amount == 1) rarity = "common";
    e(id).setAttribute("class", "card "+rarity+" animated locked");
    animationTimeout = setTimeout(()=>{
        animationTimeout = -1;
        e(id).classList.remove("locked");
        e("achieveCard").style.cssText = "display: block";
        e("challenges").innerHTML = parseChallenges(data.PLAYERS[index-1].cards);
        e("menu").style.cssText = "display: block;";
        showedCards++;
        menuActive = true;
        setTimeout(()=>{
            e("menu").style.opacity = 0.85;
        },100)
    },3000);
}
function unhideMap() {
    if(!e("cardMap").getAttribute("class").includes("unknown"))
        return;
    let rarity = 0;
    if(data.MAP.DIFF == Diffs.NIGHTMARE) rarity++;
    if(data.MAP.DIFF == Diffs.MADNESS || data.MAP.DIFF == Diffs.RANDOM) rarity += 2;
    rarity += data.MAP.DECK.cards.length;
    let textRarity = "common";
    if(rarity == 2) textRarity = "rare";
    if(rarity == 3) textRarity = "legendary";
    if(rarity > 3) textRarity = "special";
    e("cardMap").setAttribute("class", "card "+textRarity+" animated locked");
    mapShown = true;
    setTimeout(()=>{
        e("cardMap").classList.remove("locked");
        e("achieveCard").style.cssText = "display: block";
        e("challenges").innerHTML = parseChallenges(data.MAP.DECK.cards);
        e("diff").innerHTML = "Сложность: "+DiffsTranslate[data.MAP.DIFF];
        e("diff").style.display = "block";
        e("map").innerHTML = "Карта: "+data.MAP.NAME;
        e("map").style.display = "block";
        e("menu").style.cssText = "display: block;";
        if(data.MAP.DECK.cards.length == 0)
            e("challengesHeader").style.cssText = "display: none;";
        showedCards++;
        menuActive = true;
        setTimeout(()=>{
            e("menu").style.opacity = 0.85;
        },100)
    },3000);
}
function parseChallenges(cards) {
    let result = "";
    for(let i of cards)
        result += `<li>${i.name}</li>`;
    return result;
}
function nextAction() {
    if(!mapShown) {
        e("card"+lastIndex).innerHTML = "<div class='cardHelper'><ul class='cardUl'>"+parseChallenges(data.PLAYERS[lastIndex-1].cards)+"</ul></div>";
        e("card"+lastIndex).classList.add("unhidden");
    } else {
        e("cardMap").innerHTML = "<div class='cardHelper'><ul class='cardUl'><li>"+data.MAP.NAME+"</li><li>"+DiffsTranslate[data.MAP.DIFF]+"</li><br>"+parseChallenges(data.MAP.DECK.cards)+"</ul></div>";
        e("cardMap").classList.add("unhidden");
    }
    if(menuActive) {
        e("menu").style.opacity = 0;
        setTimeout(()=>{
            menuActive = false;
            e("menu").style.display = "none";
        },300);
    }
    if(showedCards == needCards) {
        e("mapCard").style.cssText = "display: flex;";
        setTimeout(()=>{
            e("mapCard").style.opacity = 1;
        },300);
    }
}
oninit();