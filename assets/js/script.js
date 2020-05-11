function addToLocalStorage(name, score){
    let oldScoreFromLocalStorage = JSON.parse(localStorage.getItem("scores"))
    if(oldScoreFromLocalStorage===null){
        const scoresInLocalStorage = [{
            name: name,
            score: score
        }]
        localStorage.setItem("scores", JSON.stringify(scoresInLocalStorage))
    }
    else{
        oldScoreFromLocalStorage.push([{
            name: name,
            score: score
        }]) 
        localStorage.setItem("scores", JSON.stringify(oldScoreFromLocalStorage))
    }
}

function getFromLocalStorage(){
    const scoresFromLocalStorage = JSON.parse(localStorage.getItem("scores"))
    //Append onto the screen
    const listElement = $("<li>").text(scoresInLocalStorage.name + " " + scoresInLocalStorage.score)
    $("ulElementOnViewScreen").append(listElement)
}


