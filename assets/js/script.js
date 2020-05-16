
      $(".ui.basic.modal").modal('show')

      $("#body").on("click", modalVisible)
      function modalVisible(){
        $(".close-modal").modal('hide')
      }
      //CORS URL
      const CORS_ANYWHERE_URL = "https://radiant-stream-08604.herokuapp.com/";

      //Superhero API URL
      const SUPERHERO_URL = "https://superheroapi.com/api/10222311384718653/";

      //Pokemon URL
      const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";

      //Declaring 2 variables set to false
      let firstCharacterRendered = false;
      let secondCharacterRendered = false;

      //Stores the universe in memory
      const universe = getUniverse();

      //User power stats
      let userPowerStats;
      let computerPowerStats;

      //Declaring counter to be used for score
      let userCounter = 0;
      let computerCounter = 0;

      // Returns user to start screen if Exit Game button is clicked
      function startScreen() {
        location.href = "index.html";
      }

      //Gets 2 random ID's. Takes in universe query
      function getRandomCharacterNumber(universe) {
        let range;
        //If the universe query is superhero, then sets range to 731 or if
        //query is pokemon, then it is set to 800. These are the items in the 
        //api
        if (universe === "superhero") {
          range = 731;
        } else if (universe === "pokemon") {
          range = 800;
        } else {
          //Handle the error if
        }
        //Gets a random character number from the range passed in from the if statement above
        const randomCharacterNumber = Math.floor(Math.random() * range);
        //Returns it so can be used
        return randomCharacterNumber;
      }

      //getUniverse gets universe set by the user and sets the queryString to that universe
      function getUniverse() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const universe = urlParams.get("universe");
        //2 possible values pokemon or superhero
        modalFunction(universe)
        return universe;
      }

      //Generates the superhero card. Takes in data from the API call
      function generateSuperheroCard(data) {
        //Dynamically creates a card for each player
        //Upper Div with class of ui fluid
        const characterCardUpperDiv = $("<div>").addClass("ui fluid");
        //Second Div
        const characterImageSecondDiv = $("<div>").addClass(
          "ui large center aligned image"
        );
        //Image for character randomly created
        const characterImage = $("<img>").attr({
          src: data.image.url,
          alt: data.name,
        });
        //Content Div which contains the image
        const characterContent = $("<div>").addClass("content");
        const characterName = $("<div>")
          .addClass("ui yellow header")
          .attr("style", "margin-top: 10px")
          .text(data.name);
        //Returns the appended card to the upper div
        return characterCardUpperDiv.append(
          characterImageSecondDiv.append(
            characterImage,
            characterContent.append(characterName)
          )
        );
      }

      //Generates the pokemon card. Takes in data from the API call
      function generatePokemonCard(data) {
        //Dynamically create the pokemon cards
        //From the data get the name of the pokemon
        const pokemonSpriteName = data.name;
        //Create an upper Div with class of card where the contents are placed
        const characterCardUpperDiv = $("<div>").addClass("card");
        //Creates a Div to contain the random image
        const characterImageSecondDiv = $("<div>").addClass("image pokeBackground");
        //Pokemon image from data given by API call
        const characterImage = $("<img>").attr({
          src: data.sprites.front_default,
          alt: data.name,
        });
        const characterContent = $("<div>").addClass("ui segment content");
        //Character name
        const characterName = $("<div>")
          .addClass("ui yellow header")
          .text(pokemonSpriteName.toUpperCase());
        //Get first ability of given pokemon
        const characterAbility = $("<div>")
          .addClass("ui green header")
          .attr("style", "text-transform: uppercase")
          .text(data.abilities[0].ability.name);
        //Return appended card
        return characterCardUpperDiv.append(
          characterImageSecondDiv.append(
            characterImage,
            characterContent.append(characterName, characterAbility)
          )
        );
      }
      
      //Renders the first character. Takes in data from the API call
      function renderFirstCharacter(data) {
        //Targets the character 1 ID from HTML
        const character1 = $("#character1");
        let card;
        //If the universe query is superhero from the user
        if (universe === "superhero") {
        //Then card is equal to the return of the function generateSuperheroCard which takes
        //in data from this rendarFirstCharacter card from the API call
          card = generateSuperheroCard(data);
        //If the universe query is pokemon from the user
        } else if (universe === "pokemon") {
        //Then card is equal to the return of the function generateSuperheroCard which takes
        //in data from this rendarFirstCharacter card from the API call
          card = generatePokemonCard(data);
        } else {
          //ERROR HANDLING
        }
        //Appends the card onto the character1
        character1.append(card);
        character1.addClass("character1Card");
        //Set the firstCharacterRendered to true as a check
        firstCharacterRendered = true;
        userPowerStats = data.powerstats;
        //playerHealth is equal to the return of the of the function getUserHealth
        let playerHealth = getUserHealth()
        //Appends the health onto the player 1 card
        $("#character1").append(generateHealthBar("PLAYER", playerHealth));
        //Checks if both are rendered function call
        checkBothRendered();
      }

      //Renders the second character. Takes in data from the API call
      function renderSecondCharacter(data) {
        //Targets the character 2 ID from HTML
        const character2 = $("#character2");
        let card;
        //If the universe query is superhero from the user
        if (universe === "superhero") {
        //Then card is equal to the return of the function generateSuperheroCard which takes
        //in data from this rendarFirstCharacter card from the API call
          card = generateSuperheroCard(data);
        //If the universe query is pokemon from the user
        } else if (universe === "pokemon") {
        //Then card is equal to the return of the function generateSuperheroCard which takes
        //in data from this rendarFirstCharacter card from the API call
          card = generatePokemonCard(data);
        } else {
          //ERROR HANDLING
        }
        //Appends the card onto the character2
        character2.append(card);
        character2.addClass("character2Card");
        //Set the firstCharacterRendered to true as a check
        secondCharacterRendered = true;
        computerPowerStats = data.powerstats;
        //playerHealth is equal to the return of the of the function getUserHealth
        let cpuHealth = getCPUHealth()
        $("#character2").append(generateHealthBar("CPU",cpuHealth));
        //Checks if both are rendered function call
        checkBothRendered();
      }
      //Generates the health bar for the cards which takes in playerType and health
      //playerType is either a string of PLAYER or a string of CPU
      //health is given in and this changes the length of the health bar
      function generateHealthBar(playerType, health) {
        //Upper Div for the health bar to append to
        const healthBarColumn = $("<div>").addClass("ui six wide column");
        //progressSuccess is what progress bar we chose from Semantic UI
        const progressSuccess = $("<div>").attr({
          class: "ui progress success",
          "data-percent":  100,
          style: "margin-top: 10px"
        });
        //progressBar is the health of the player
        const progressBar = $("<div>").attr({
          class: "bar playerType",
          style: "transition-duration: 300ms; width:" + health + "%;",
        });

        //The text under the health bar
        const progressText = $("<div>")
          .attr({
            class: "ui progress yellow header",
            id: "characterType",
          })
          .text(playerType);
        //Returns the appended health bar
        return healthBarColumn.append(
          progressSuccess.append(progressBar, progressText)
        );
      }
      //local storage health takes in userHealthValue and cpuHealthValue
      function healthInLocalStorage(userHealthValue,cpuHealthValue){
        //Creates an object with userHealth and cpuHealth to add into localStorage
        let health = {
          userHealth : userHealthValue,
          cpuHealth : cpuHealthValue
        }
        //Sets into localStorage
        localStorage.setItem("health", JSON.stringify(health))
      }

      //Returns userHeatlh from localStorage
      function getUserHealth(){
        const userHealthValue = JSON.parse(localStorage.getItem("health"))
        return userHealthValue.userHealth
      }
      
      //Returns cpuHeatlh from localStorage
      function getCPUHealth(){
        const cpuHealthValue = JSON.parse(localStorage.getItem("health"))
        return cpuHealthValue.cpuHealth
      }

      //setHealthValue sets the player's health in localStorage over writting the previous health
      function setHealthValue(player, health){
        let healthValue = JSON.parse(localStorage.getItem("health"))
        healthValue[player]=health
        localStorage.setItem("health", JSON.stringify(healthValue))
        
      }
      //Checks both Rendered
      function checkBothRendered() {
        // If first 2 characters are rendered do something
        if (firstCharacterRendered && secondCharacterRendered) {
          //If user selects superhero, then renderPowerstatButtons function is run
          if (universe === "superhero") {
            renderPowerstatButtons();
          }
          //If user selects pokemon, then renderAbilitiesButtons function is run
          if (universe === "pokemon") {
            renderAbilitiesButtons();
          }
        }
      }

      //Function to render the game controls like exit game, start game button and randomize cards
      function renderGameControl() {
        //Create the start div to append to
        const startButtonsDiv = $("<div>")
            .addClass("ui vertical buttons");
        //create a new button for the exit game button
        const exitGame = $("<button>")
          .addClass("ui center aligned red button")
          .text("EXIT GAME");
        //Appends it onto the HTML by targetting the id exitGame
        $("#exitGame").append(exitGame);
        //Create the randomize button
        const randomizeButton = $("<button>")
          .addClass("ui blue button")
          .attr("style","margin-bottom: 10px")
          .text("RANDOMIZE AGAIN");
        //Create the start game button
        const startGameButton = $("<button>")
          .addClass("ui olive button startButton")
          .text("START GAME");
        //Appends the randomize and start game buttons onto the start div
        startButtonsDiv.append(randomizeButton, startGameButton);
        //Appends start div onto the HTML
        $("#renderButtons").append(startButtonsDiv);
        //Event listerners for the exit game, randomize and start game buttons to prevent multiple clicks
        randomizeButton.on("click", randomizeAgain);
        startGameButton.on("click", preventMultipleClicks);
        exitGame.on("click", startScreen);
      }

      // Reloads page to produce two new randomized characters
      function randomizeAgain() {
        location.reload();
      }

      //Renders the power stats buttons for the superheros
      function renderPowerstatButtons() {
        //Empty the div for renderButtons
        $("#renderButtons").empty();
        //Creates a div for the buttons to append to
        const buttonsDiv = $("<div>")
          .addClass("ui vertical buttons")
          .attr("id", "powerstatsButtons");
        //Creates the intelligence button
        const intelligenceButton = $("<button>")
          .addClass("large ui teal button powerstat")
          .attr({
            "data-intelligence": userPowerStats.intelligence,
            id: "powerstat",
          })
          .text("Intelligence");
        //Creates the strength button
        const strengthButton = $("<button>")
          .addClass("large ui blue button powerstat")
          .attr({ 
              "data-strength": userPowerStats.strength, 
              id: "powerstat",
            })
          .text("Strength");
        //Creates the speed button
        const speedButton = $("<button>")
          .addClass("large ui purple button powerstat")
          .attr({ 
              "data-speed": userPowerStats.speed, 
              id: "powerstat",
            })
          .text("Speed");
        //Creates the durability button
        const durabilityButton = $("<button>")
          .addClass("large ui pink button powerstat")
          .attr({
            "data-durability": userPowerStats.durability,
            id: "powerstat",
          })
          .text("Durability");
        //Creates the power button
        const powerButton = $("<button>")
          .addClass("large ui orange button powerstat")
          .attr({ "data-power": userPowerStats.power, id: "powerstat" })
          .text("Power");
        //Appends the buttons onto the buttons div
        buttonsDiv.append(
          intelligenceButton,
          strengthButton,
          speedButton,
          durabilityButton,
          powerButton
        );
        //Appends the buttons div onto the html
        $("#renderButtons").append(buttonsDiv);
        //Event Listerner for each button with id powerstat.
        //Prevents the buttons from beng clicked multiple times
        $(".powerstat").on("click", preventMultipleClicks);
      }

      //Renders the abilities buttons for pokemon
      function renderAbilitiesButtons() {
        //Empty the div for renderButtons
        $("#renderButtons").empty();
        //Adds animation for class .pokemonAbility
        $(".pokemonAbility").transition("flash");
        //Creates 2 random numbers. One for the attack button and one for defence button
        const userAttackAbilityNumber = Math.floor(Math.random() * 100);
        const userDefendAbilityNumber = Math.floor(Math.random() * 100);
        //Creates an upper div called buttonsDiv
        const buttonsDiv = $("<div>")
          .addClass("ui vertical buttons")
          .attr("id", "powerstatsButtons");
        //Creates the attack button
        const attackButton = $("<button>")
          .addClass("large ui red button abilityStat")
          //For the data-attack attribute, assign the random attack number
          .attr({ "data-attack": userAttackAbilityNumber, id: "abilityStat" })
          .text("Attack");
        //Creates the defend button
        const defendButton = $("<button>")
          .addClass("large ui yellow button abilityStat")
          //For the data-defend attribute, assign the random defend number
          .attr({ "data-defend": userDefendAbilityNumber, id: "abilityStat" })
          .text("Defend");
        //Appends the attack button and defend button onto the buttonsDiv
        buttonsDiv.append(attackButton, defendButton);
        //Appends the buttonsDiv onto the HTML div
        $("#renderButtons").append(buttonsDiv);
        //Each element with class abilityStat, creates an event listerner to prevent multiple clicks
        $(".abilityStat").on("click", preventMultipleClicks);
      }

      // Prevents buttons from being clicked multiple times which would trigger another API call
      function preventMultipleClicks() {
        //buttonObjectAttribute is the data object
        const buttonObjectAttribute = $(this).data();
        //If the button clicked id is equal to powerstat
        if ($(this).attr("id") === "powerstat") {
          //Set it's attribute to disabled to prevent multiple clicks
          $(".powerstat").attr("disabled", true);
          //And give the data to compareStatsWithComputer function
          compareStatsWithComputer(buttonObjectAttribute);
        //Else if the id is equal to abilityStat
        } else if ($(this).attr("id") === "abilityStat") {
          //Set it's attribute to disabled to prevent multiple clicks
          $(".abilityStat").attr("disabled", true);
          //And give the data to compareStatsWithComputer function
          compareAbilityWithComputer(buttonObjectAttribute);
        } else {
          //Else, targetting the startButton and set it to disabled
          $(".startButton").attr("disabled", true);
          //Call the random characters from api function
          getRandomCharactersFromApi();
        }
        //Set the powerstat elements to enabled
        $(".powerstat").attr("disabled", false);
      }

      //This function takes in a object to calculate if they won
      function compareStatsWithComputer(buttonObjectAttribute) {
        //Sets a new variable with the object
        const powerstatObject = buttonObjectAttribute;
        //Creates an array from the object
        const powerstatArray = Object.entries(powerstatObject);
        //Gets the userAbility from the array at array 0 index 0
        const userAbility = powerstatArray[0][0];
        //Gets the userAbility from the array at array 0 index 1
        const userAbilityValue = powerstatArray[0][1];
        //Gets the userAbilityValue
        const computerAbilityValue = computerPowerStats[userAbility];
        //If user ability value is less than the computer ability value
        if (userAbilityValue < computerAbilityValue) {
          //Then run the computer wins function
          computerWins();
        //Else if the user ability is greater than the conputer ability
        } else if (userAbility > computerAbilityValue) {
          //Then the userWins function is run
          userWins();
        //Elsem, the tiePoint function is run
        } else {
          tiePoint();
        }
        //If the userHealth is 0 then computer wins and vise versa
        let userHealthValue = getUserHealth()
        let cpuHealthValue = getCPUHealth()
        if(userHealthValue === 0){
            computerWins();
        } else if (cpuHealthValue === 0){
            userWins()
        }
        //Runs the random character from API to show new characters on screen
        getRandomCharactersFromApi();
      }

      //This is for the pokemon score
      function compareAbilityWithComputer(buttonObjectAttribute) {
        //Sets a new variable with the object
        const powerstatObject = buttonObjectAttribute;
        //Makes an array with Key and value pairs from the powerstatObject
        const powerstatArray = Object.entries(powerstatObject);
        //Gets the userAbility from the array at array 0 index 0
        const userAbility = powerstatArray[0][0];
        //Gets the userAbility from the array at array 0 index 1
        const userAbilityValue = powerstatArray[0][1];
        //Makes 2 random numbers for the attack button and defend button
        const computerDefendValue = Math.floor(Math.random() * 100);
        const computerAttackValue = Math.floor(Math.random() * 100);
        //If user clicked attack
        if (userAbility === "attack") {
          //If the user ability is greater than the conputer ability
          if (userAbilityValue > computerDefendValue) {
            //Then the userWins function is run
            userWins();
            //Else if user ability value is less than the computer ability value
          } else if (userAbilityValue < computerDefendValue) {
            //Then run the computer wins function
            computerWins();
            //Elsem, the tiePoint function is run
          } else {
            tiePoint();
          }
        }
        //If user clicked defend
        if (userAbility === "defend") {
          //If the user ability is greater than the conputer ability
          if (userAbilityValue > computerAttackValue) {
            //Then the userWins function is run
            userWins();
            //Else if user ability value is less than the computer ability value
          } else if (userAbilityValue < computerAttackValue) {
            //Then run the computer wins function
            computerWins();
            //Elsem, the tiePoint function is run
          } else {
            tiePoint();
          }
        }
        //If the userHealth is 0 then computer wins and vise versa
        let userHealthValue = getUserHealth()
        let cpuHealthValue = getCPUHealth()
        if(userHealthValue === 0){
            computerWins();
        } else if (cpuHealthValue === 0){
            userWins()
        }
        //Runs the random character from API to show new characters on screen
        getRandomCharactersFromApi();
      }


      //A function for evaluating the player health which takes in the player and the health value for
      //the current value for the user/cpu
      function playerHealth(player,playerHealthValue) {
        let health = 100;
        //Switch statement for the tries from user and cpu
        switch (playerHealthValue) {
          //All cases sets the health down by 25 from 100 and passes that into the setHealthValue
          case 1:
            health = 75
            //setHealthValue takes in the player and health to assign it to either the CPU or User
            setHealthValue(player, health);
            break
          case 2:
            health = 50
            setHealthValue(player, health);
            break
          case 3:
            health = 25
            setHealthValue(player, health);
            break
          case 4:
            health = 0
            setHealthValue(player, health);
            break
        }
      }

      //User wins function that contains the animation for the first character card
      function userWins() {
        //Character animation for the card
        $("#character1").transition("vertical flip");
        $("#character1").transition("vertical flip");
        //Increments the userCounter
        userCounter++;
        //Puts in the string userHealth and the userCounter. userHealth is the same name for the
        //key in localStorage to assign it to the user
        playerHealth("userHealth", userCounter);
        //If user health equals 0 then make the end screen be displayed by removing the display none class
        let userHealthValue = getUserHealth()
        if (userHealthValue === 0) {
            $("#mainGameScreen").addClass("display");
            $("#finalScore").removeClass("display");
          }
      }

      //User wins function that contains the animation for the second character card
      function computerWins() {
        //Character animation for the card
        $("#character2").transition("vertical flip");
        $("#character2").transition("vertical flip");
        //Increments the computerCounter
        computerCounter++;
        //Puts in the string cpuHealth and the cpuCounter. cpuHealth is the same name for the
        //key in localStorage to assign it to the opponent
        playerHealth("cpuHealth", userCounter);
        if (computerCounter === 4) {
          $("#mainGameScreen").addClass("display");
          $("#finalScore").removeClass("display");
        }
        //If cpu health equals 0 then make the end screen be displayed by removing the display none class
        let cpuHealthValue = getCPUHealth()
        if (cpuHealthValue === 0) {
            $("#mainGameScreen").addClass("display");
            $("#finalScore").removeClass("display");
          }
      }

      //tiePoint function that if the score is the same, animate both cards
      function tiePoint() {
        $("#character1").transition("vertical flip");
        $("#character2").transition("vertical flip");
        $("#character1").transition("vertical flip");
        $("#character2").transition("vertical flip");
      }

      //Generates the the ajax calls, takes in the universe and the random character number depending on
      //the universe
      function generateAjaxOptions(universe, randomCharacterId) {
        let url;
        //If the universe is superhero or pokemon then it sets the url variable to either
        //the superhero url or pokemon url (base url without any queries)
        if (universe === "superhero") {
          url = SUPERHERO_URL;
        } else if (universe === "pokemon") {
          url = POKEMON_URL;
        } else {
          //ERROR HANDLING
        }
        //Ajax call options
        const ajaxOptions = {
          //url is the cors url with either the superhero/pokemon url and random character id from above
          url: CORS_ANYWHERE_URL + url + randomCharacterId,
          //The method we are using for the API call
          method: "GET",
          //The type of data recieved which is in JSON
          dataType: "json",
          //The headers for the API
          headers: {
            "x-requested-with": "xhr",
          },
        };
        //Returns the ajax call options
        return ajaxOptions;
      }

      function modalFunction(universe){
        if(universe==="superhero"){
          $("#howToPlayHeader").text("Superhero Game Rules").attr("style", "text-align: center")
          const line1 = $("<p>").text("- Click on the image of the SuperHero to get started")
          const line2 = $("<p>").text("-You will then be presented with two random SuperHeros (yours on the left, and you CPU's on the right)")
          const line3 = $("<p>").text("- Either \"Randomize Again\" or to \"Start Game\" by clicking one of those buttons")
          const line4 = $("<p>").text("- When the game has started, you then have to choose carefully which Powerstat you want to use against your opponent.")
          const line5 = $("<p>").text("- If yours beats their equivalent Powerstat, then you will have defeated that opponent and the CPU's health bar will go down and vice versa.")
          const line6 = $("<p>").text("- Whichever players health bar reaches 0 first will lose.")
          const line7 = $("<p>").text("- See how many SuperHeros you can defeat!!")
          
          $("#howToPlayContent").append(line1,line2,line3,line4,line5,line6,line6,line7)
        }else if(universe==="pokemon"){
          $("#howToPlayHeader").text("Pokemon Game Rules")
          const line1 = $("<p>").text("- Click on the image of the Pokemon universe to get started")
          const line2 = $("<p>").text("- You will then be presented with two random Pokemons (yours on the left, and you CPU's on the right)")
          const line3 = $("<p>").text("- Either \"Randomize Again\" or to \"Start Game\" by clicking one of those buttons")
          const line4 = $("<p>").text("- When the game has started, you then have to choose carefully whether to attack your opponent or defend against them with your selected ability (which will flash green beneath your Pokemon name).")
          const line5 = $("<p>").text("- If you are successful in your Attack or Defend, then the CPU's health bar will go down and vice versa.")
          const line6 = $("<p>").text("- Whichever players health bar reaches 0 first will lose.")
          const line7 = $("<p>").text("- See how many Pokemon's you can defeat!!")
          $("#howToPlayContent").append(line1,line2,line3,line4,line5,line6,line6,line7)
        }

      }

      //Renders the characters and generates the cards using the API
      function getRandomCharactersFromApi() {
        //Empty previous characters
        $("#character1").empty();
        $("#character2").empty();
        //Empty the health bar
        $("#healthBar").empty()
        //Stores the random character ID into randomCharacterId's for a given universe
        const randomCharacterId1 = getRandomCharacterNumber(universe);
        const randomCharacterId2 = getRandomCharacterNumber(universe);
        //Ajax call. generateAjaxOptions takes in the universe and the randomCharacterId1 to
        //render the first character from the API call to get the data
        $.ajax(generateAjaxOptions(universe, randomCharacterId1)).then(
          renderFirstCharacter
        );
        //Ajax call. generateAjaxOptions takes in the universe and the randomCharacterId2 to
        //render the first character from the API call to get the data
        $.ajax(generateAjaxOptions(universe, randomCharacterId2)).then(
          renderSecondCharacter
        );
      }
      // Local Storage
      let score;
      //Save score function from event listerner
      function saveScore() {
        const scoreSaveInput = $("#scoreSaveInput").val();
        addToLocalStorage(scoreSaveInput);
        getFromLocalStorage() 
      }
      $("#scoreSaveButton").on("click", saveScore);
      //Adds Name into local storage
      function addToLocalStorage(name) {
        let oldScoreFromLocalStorage = JSON.parse(
          localStorage.getItem("scores")
        );
        if (oldScoreFromLocalStorage === null) {
          const scoresInLocalStorage = [name];
          localStorage.setItem("scores", JSON.stringify(scoresInLocalStorage));
        } else {
          oldScoreFromLocalStorage.push([name]);
          localStorage.setItem(
            "scores",
            JSON.stringify(oldScoreFromLocalStorage)
          );
        }
      }
      //Get from local storage and add into HTML
      getFromLocalStorage() 
      function getFromLocalStorage() {
        const scoresFromLocalStorage = JSON.parse(
          localStorage.getItem("scores")
        );
        if(scoresFromLocalStorage===null){
          return []
        } else {
          const ulElement = $("<div>").addClass("ui relaxed divided list")
          const itemDiv = $("<div>").addClass("item")
          const contentDiv = $("<div>").addClass("content")
                      
          scoresFromLocalStorage.forEach(function(index){
            let listElement = $("<p>").text(index).addClass("ui medium header listElement")
            $("#finalScore").append(ulElement.append(itemDiv.append(contentDiv.append(listElement))));
          })   
        }     
      }
      //Sets the health in local storage to 100 for both users
      healthInLocalStorage(100,100)
      //Renders the game controls
      renderGameControl();

      //Firework Celebration
      window.human = false;

      var canvasEl = document.querySelector(".fireworks");
      var ctx = canvasEl.getContext("2d");
      var numberOfParticules = 30;
      var pointerX = 0;
      var pointerY = 0;
      var tap =
        "ontouchstart" in window || navigator.msMaxTouchPoints
          ? "touchstart"
          : "mousedown";
      var colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];

      function setCanvasSize() {
        canvasEl.width = window.innerWidth * 2;
        canvasEl.height = window.innerHeight * 2;
        canvasEl.style.width = window.innerWidth + "px";
        canvasEl.style.height = window.innerHeight + "px";
        canvasEl.getContext("2d").scale(2, 2);
      }

      function updateCoords(e) {
        pointerX = e.clientX || e.touches[0].clientX;
        pointerY = e.clientY || e.touches[0].clientY;
      }

      function setParticuleDirection(p) {
        var angle = (anime.random(0, 360) * Math.PI) / 180;
        var value = anime.random(50, 180);
        var radius = [-1, 1][anime.random(0, 1)] * value;
        return {
          x: p.x + radius * Math.cos(angle),
          y: p.y + radius * Math.sin(angle),
        };
      }

      function createParticule(x, y) {
        var p = {};
        p.x = x;
        p.y = y;
        p.color = colors[anime.random(0, colors.length - 1)];
        p.radius = anime.random(16, 32);
        p.endPos = setParticuleDirection(p);
        p.draw = function () {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
          ctx.fillStyle = p.color;
          ctx.fill();
        };
        return p;
      }

      function createCircle(x, y) {
        var p = {};
        p.x = x;
        p.y = y;
        p.color = "#FFF";
        p.radius = 0.1;
        p.alpha = 0.5;
        p.lineWidth = 6;
        p.draw = function () {
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
          ctx.lineWidth = p.lineWidth;
          ctx.strokeStyle = p.color;
          ctx.stroke();
          ctx.globalAlpha = 1;
        };
        return p;
      }

      function renderParticule(anim) {
        for (var i = 0; i < anim.animatables.length; i++) {
          anim.animatables[i].target.draw();
        }
      }

      function animateParticules(x, y) {
        var circle = createCircle(x, y);
        var particules = [];
        for (var i = 0; i < numberOfParticules; i++) {
          particules.push(createParticule(x, y));
        }
        anime
          .timeline()
          .add({
            targets: particules,
            x: function (p) {
              return p.endPos.x;
            },
            y: function (p) {
              return p.endPos.y;
            },
            radius: 0.1,
            duration: anime.random(1200, 1800),
            easing: "easeOutExpo",
            update: renderParticule,
          })
          .add({
            targets: circle,
            radius: anime.random(80, 160),
            lineWidth: 0,
            alpha: {
              value: 0,
              easing: "linear",
              duration: anime.random(600, 800),
            },
            duration: anime.random(1200, 1800),
            easing: "easeOutExpo",
            update: renderParticule,
            offset: 0,
          });
      }

      var render = anime({
        duration: Infinity,
        update: function () {
          ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        },
      });

      document.addEventListener(
        tap,
        function (e) {
          window.human = true;
          render.play();
          updateCoords(e);
          animateParticules(pointerX, pointerY);
        },
        false
      );

      var centerX = window.innerWidth / 2;
      var centerY = window.innerHeight / 2;

      function autoClick() {
        if (window.human) return;
        animateParticules(
          anime.random(centerX - 50, centerX + 50),
          anime.random(centerY - 50, centerY + 50)
        );
        anime({ duration: 200 }).finished.then(autoClick);
      }

      autoClick();
      setCanvasSize();
      window.addEventListener("resize", setCanvasSize, false);


      