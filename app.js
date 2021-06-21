//#region GAME AND SAVE LOGIC AND DATA

/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let kittenName = event.target.name.value;
  let kittenDuplicate = kittens.findIndex((kitten) => kitten.name === kittenName);
  
  if (kittenDuplicate > -1){
    alert("That name is already in use.")
  } else{
    let form = event.target
    
    let kitten = {
      id: generateId(),
      name:form.name.value,
      mood: "Tolerant",
      affection: 5,
      CnAmount: 5,
      CnAvalible: "Give Catnip",

    }
    
    kittens.push(kitten)
    saveKittens()
    form.reset()
  }
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let storedKittens = JSON.parse(window.localStorage.getItem("kittens"))
  if(storedKittens){
    kittens = storedKittens
  }
  if(kittens.length > 0){
    document.getElementById("reset").classList.remove("hidden");
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenElement = document.getElementById("kittens")
  let kittenTemplate = ""
  kittens.forEach(kitten => {
    kittenTemplate += `
    <div id ="kitten" class="card kitten ${kitten.mood}" >
    <center>
    <img class="kitten" src="https://www.robohash.org/set_set4/${kitten.name}" height="90" width="90" >
    </center>  
    <p class="d-flex justify-content-left">Name: ${kitten.name}</p>
    <p class="d-flex justify-content-left">Mood: ${kitten.mood}</p>
    <p class="d-flex justify-content-left">Affection: ${kitten.affection}</p>
    <p class="d-flex justify-content-left">Catnip Left: ${kitten.CnAmount}</p>
    <button class = "ck" onclick="pet('${kitten.id}')">Pet Cat</button>
    <p></p>
    <button onclick="catnip('${kitten.id}')">${kitten.CnAvalible}</button>
    </div>
    `
  })
  kittenElement.innerHTML = kittenTemplate
  
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let currentKitten = findKittenById(id)
  let randomNum = Math.random()
  if (randomNum > 0.7) {
    currentKitten.affection ++;
    setKittenMood(currentKitten)
    saveKittens()
  } else 
  currentKitten.affection --;
  setKittenMood(currentKitten)
  saveKittens()
}


/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let currentKitten = findKittenById(id)
  if (currentKitten.CnAmount > 0){
    document.getElementById("kittens").classList.remove(currentKitten.mood)
    currentKitten.mood = "Tolerant"
    currentKitten.affection = 5;
    currentKitten.CnAmount --;
    currentKitten.CnAvalible = "Give CatNip"
  } 
  if(currentKitten.CnAmount <= 0){
    currentKitten.CnAvalible = "Ran Out"
    alert ("You are out of Capnip!")
  }
  saveKittens()
  
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  if (kitten.affection >= 7){
    kitten.mood = "happy"
  }
  if (kitten.affection <= 5){
    kitten.mood = "tolerant"
  }
  if (kitten.affection <=3 ){
    kitten.mood = "angry"
  }
  if (kitten.affection <= 0){
    kitten.mood = "gone"
  }
  saveKittens()
}

function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
  document.getElementById("kittens").classList.remove("hidden");
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function clearKittenButton(){
  document.getElementById("reset").classList.add("hidden");
}

function resetGame(){
  kittens = []
  saveKittens()
  clearKittenButton()
}


function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
    );
  }
  
  //#endregion

  loadKittens()
  drawKittens()