let data = null;
let lastIndex = -1;
let showedCards = 0;
let needCards = 4;
let mapShown = false;

function oninit() {
    Lib.BubblyButton();
    Lib.AnimatedCards();
}
function generate(players) {
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
    setTimeout(()=>{
        e(id).classList.remove("locked");
        e("achieveCard").style.cssText = "display: block";
        e("challenges").innerHTML = parseChallenges(data.PLAYERS[index-1].cards);
        e("menu").style.cssText = "display: block;";
        showedCards++;
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
    if(rarity == 1) textRarity = "rare";
    if(rarity == 2) textRarity = "legendary";
    if(rarity > 2) textRarity = "special";
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
    e("menu").style.opacity = 0;
    setTimeout(()=>{
        e("menu").style.display = "none";
    },300);
    if(showedCards == needCards) {
        e("mapCard").style.cssText = "display: flex;";
        setTimeout(()=>{
            e("mapCard").style.opacity = 1;
        },300);
    }
}
oninit();