let Lang = {};
let ActiveLang = {};
function init_lang() {
    if(!localStorage.getItem("lang")) {
        if(navigator.language.toUpperCase() in Lang) {
            localStorage.setItem("lang", navigator.language.toUpperCase())
        } else localStorage.setItem("lang", "EN")
    }
    let lang = localStorage.getItem("lang");
    ActiveLang = Lang[lang];
}
function getLang(name) {
    if(!(name in ActiveLang))
        return name;
    return ActiveLang[name]
}
function localizeDOMElements() {
    e("achieveHeader").innerHTML = getLang("ACHIEVE_HEADER");
    e("challengesHeader").innerHTML = getLang("CHALLENGES_HEADER");
    e("continueButton").innerHTML = getLang("CONTINUE");
    e("pickHeader").innerHTML = getLang("PICK_HEADER");
    e("discordLabel").innerHTML = getLang("DISCORD");
    e("hardmodeLabel").innerHTML = getLang("HARDMODE");
}
function changeLanguage(lang) {
    localStorage.setItem("lang", lang);
    window.location.reload();
}