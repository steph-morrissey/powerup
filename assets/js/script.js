const CORS_ANYWHERE_URL = "https://radiant-stream-08604.herokuapp.com/";
      const SUPERHERO_URL = "https://superheroapi.com/api/10222311384718653/";
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

      //Gets 2 random ID's
      function getRandomCharacterNumber(universe) {
        let range;
        if (universe === "superhero") {
          range = 731;
        } else if (universe === "pokemon") {
          range = 800;
        } else {
          //Handle the error if
        }
        const randomCharacterNumber = Math.floor(Math.random() * range);
        return randomCharacterNumber;
      }

      //getUniverse gets universe set by the user and sets the queryString to that universe
      function getUniverse() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const universe = urlParams.get("universe");
        //2 possible values pokemon or superhero
        return universe;
      }

      //Generates the superhero card
      function generateSuperheroCard(data) {
        const characterCardUpperDiv = $("<div>").addClass("ui fluid");
        const characterImageSecondDiv = $("<div>").addClass(
          "ui large center aligned image"
        );
        const characterImage = $("<img>").attr({
          src: data.image.url,
          alt: data.name,
        });
        const characterContent = $("<div>").addClass("content");
        const characterName = $("<div>")
          .addClass("ui yellow header")
          .text(data.name);
        return characterCardUpperDiv.append(
          characterImageSecondDiv.append(
            characterImage,
            characterContent.append(characterName)
          )
        );
      }

      //Generates the pokemon card
      function generatePokemonCard(data) {
        const pokemonSpriteName = data.name;
        const characterCardUpperDiv = $("<div>").addClass("card");
        const characterImageSecondDiv = $("<div>").addClass("image");
        const characterImage = $("<img>").attr({
          src: data.sprites.front_default,
          alt: data.name,
        });
        const characterContent = $("<div>").addClass("ui segment content");
        const characterName = $("<div>")
          .addClass("ui yellow header")
          .text(pokemonSpriteName.toUpperCase());
        const characterAbility = $("<div>")
          .addClass("ui green header pokemonAbility")
          .text(data.abilities[0].ability.name);
        return characterCardUpperDiv.append(
          characterImageSecondDiv.append(
            characterImage,
            characterContent.append(characterName, characterAbility)
          )
        );
      }
      
      function generateHealthBar(playerType, health) {
        const healthBarColumn = $("<div>").addClass("ui six wide column");
        const progressSuccess = $("<div>").attr({
          class: "ui progress success",
          "data-percent": health,
        });
        const progressBar = $("<div>").attr({
          class: "bar playerType",
          style: "transition-duration: 300ms; width:" + health + "%;",
        });
        const progressText = $("<div>")
          .attr({
            class: "ui progress yellow header",
            id: "characterType",
          })
          .text(playerType);
        return healthBarColumn.append(
          progressSuccess.append(progressBar, progressText)
        );
      }
      //Renders the first character
      function renderFirstCharacter(data) {
        const character1 = $("#character1");
        let card;
        if (universe === "superhero") {
          card = generateSuperheroCard(data);
        } else if (universe === "pokemon") {
          card = generatePokemonCard(data);
        } else {
          //ERROR HANDLING
        }
        let playerHealth = getUserHealth()
        $("#healthBar").append(generateHealthBar("PLAYER", playerHealth));
        character1.append(card);
        character1.addClass("character1Card");
        firstCharacterRendered = true;
        userPowerStats = data.powerstats;
        checkBothRendered();
      }

      //Renders the second character
      function renderSecondCharacter(data) {
        const character2 = $("#character2");
        let card;
        if (universe === "superhero") {
          card = generateSuperheroCard(data);
        } else if (universe === "pokemon") {
          card = generatePokemonCard(data);
        } else {
          //ERROR HANDLING
        }
        let cpuHealth = getCPUHealth()
        $("#healthBar").append(generateHealthBar("CPU",cpuHealth));
        character2.append(card);
        character2.addClass("character2Card");
        secondCharacterRendered = true;
        computerPowerStats = data.powerstats;
        checkBothRendered();
      }

      //Checks both Rendered
      function checkBothRendered() {
        // If first 2 characters are rendered do something
        if (firstCharacterRendered && secondCharacterRendered) {
          if (universe === "superhero") {
            renderPowerstatButtons();
          }

          if (universe === "pokemon") {
            renderAbilitiesButtons();
          }
        }
      }

      function renderGameControl() {
        const exitGame = $("<button>")
          .addClass("ui center aligned red button")
          .text("EXIT GAME");
        $("#exitGame").append(exitGame);
        const startButtonsDiv = $("<div>").addClass("ui vertical buttons");
        const randomizeButton = $("<button>")

          .addClass("ui blue button")
          .text("RANDOMIZE AGAIN");
        const startGameButton = $("<button>")
          .addClass("ui olive button")

          .text("START GAME");
        startButtonsDiv.append(randomizeButton, startGameButton);
        $("#renderButtons").append(startButtonsDiv);
        $("#body").removeClass("ui active dimmer");
        randomizeButton.on("click", randomizeAgain);
        startGameButton.on("click", preventMultipleClicks);
        exitGame.on("click", startScreen);
      }

      // Reloads page to produce two new randomized characters
      function randomizeAgain() {
        location.reload();
      }

      function renderPowerstatButtons() {
        $("#renderButtons").empty();
        const buttonsDiv = $("<div>")
          .addClass("ui vertical buttons")
          .attr("id", "powerstatsButtons");
        const intelligenceButton = $("<button>")

          .addClass("large ui teal button powerstat")
          .attr({
            "data-intelligence": userPowerStats.intelligence,
            id: "powerstat",
          })
          .text("Intelligence");
        const strengthButton = $("<button>")
          .addClass("large ui blue button powerstat")
          .attr({ "data-strength": userPowerStats.strength, id: "powerstat" })
          .text("Strength");
        const speedButton = $("<button>")
          .addClass("large ui purple button powerstat")
          .attr({ "data-speed": userPowerStats.speed, id: "powerstat" })
          .text("Speed");
        const durabilityButton = $("<button>")
          .addClass("large ui pink button powerstat")
          .attr({
            "data-durability": userPowerStats.durability,
            id: "powerstat",
          })
          .text("Durability");
        const powerButton = $("<button>")
          .addClass("large ui orange button powerstat")
          .attr({ "data-power": userPowerStats.power, id: "powerstat" })

          .text("Power");
        buttonsDiv.append(
          intelligenceButton,
          strengthButton,
          speedButton,
          durabilityButton,
          powerButton
        );
        $("#renderButtons").append(buttonsDiv);

        $(".powerstat").on("click", preventMultipleClicks);
      }

      function renderAbilitiesButtons() {
        $("#renderButtons").empty();
        $(".pokemonAbility").transition("flash");
        const userAttackAbilityNumber = Math.floor(Math.random() * 100);
        const userDefendAbilityNumber = Math.floor(Math.random() * 100);
        const buttonsDiv = $("<div>")
          .addClass("ui vertical buttons")
          .attr("id", "powerstatsButtons");
        const attackButton = $("<button>")
          .addClass("large ui red button abilityStat")
          .attr({ "data-attack": userAttackAbilityNumber, id: "abilityStat" })
          .text("Attack");
        const defendButton = $("<button>")
          .addClass("large ui yellow button abilityStat")
          .attr({ "data-defend": userDefendAbilityNumber, id: "abilityStat" })
          .text("Defend");
        buttonsDiv.append(attackButton, defendButton);
        $("#renderButtons").append(buttonsDiv);
        $(".abilityStat").on("click", preventMultipleClicks);
      }

      // Prevents buttons from being clicked multiple times which would trigger another API call
      function preventMultipleClicks() {
        const buttonObjectAttribute = $(this).data();
        if ($(this).attr("id") == "powerstat") {
          $(".powerstat").attr("disabled", true);
          compareStatsWithComputer(buttonObjectAttribute);
        } else if ($(this).attr("id") == "abilityStat") {
          $(".powerstat").attr("disabled", true);
          compareAbilityWithComputer(buttonObjectAttribute);
        } else {
          $(".startButton").attr("disabled", true);
          getRandomCharactersFromApi();
        }
        $(".powerstat").attr("disabled", false);
      }


      function compareStatsWithComputer(buttonObjectAttribute) {
        const powerstatObject = buttonObjectAttribute;
        const powerstatArray = Object.entries(powerstatObject);
        const userAbility = powerstatArray[0][0];
        const userAbilityValue = powerstatArray[0][1];
        const computerAbilityValue = computerPowerStats[userAbility];
        if (userAbilityValue < computerAbilityValue) {
          computerWins();
        } else if (userAbility > computerAbilityValue) {
          userWins();
        } else {
          tiePoint();
        }
        getRandomCharactersFromApi();
      }

      function compareAbilityWithComputer(buttonObjectAttribute) {
        const powerstatObject = buttonObjectAttribute;

        const powerstatArray = Object.entries(powerstatObject);
        const userAbility = powerstatArray[0][0];
        const userAbilityValue = powerstatArray[0][1];
        const computerDefendValue = Math.floor(Math.random() * 100);
        const computerAttackValue = Math.floor(Math.random() * 100);
        if (userAbility === "attack") {
          if (userAbilityValue > computerDefendValue) {
            userWins();
          } else if (userAbilityValue < computerDefendValue) {
            computerWins();
          } else {
            tiePoint();
          }
        }
        if (userAbility === "defend") {
          if (userAbilityValue > computerAttackValue) {
            userWins();
          } else if (userAbilityValue < computerAttackValue) {
            computerWins();
          } else {
            tiePoint();
          }
        }
        getRandomCharactersFromApi();
      }


      //local storage health
      function healthInLocalStorage(userHealthValue,cpuHealthValue){
        let health = {
          userHealth : userHealthValue,
          cpuHealth : cpuHealthValue
        }
        localStorage.setItem("health", JSON.stringify(health))
      }

      function getUserHealth(){
        const userHealthValue = JSON.parse(localStorage.getItem("health"))
        return userHealthValue.userHealth
      }
      function getCPUHealth(){
        const cpuHealthValue = JSON.parse(localStorage.getItem("health"))
        return cpuHealthValue.cpuHealth
      }

      function setHealthValue(player, health){
        let healthValue = JSON.parse(localStorage.getItem("health"))
        healthValue[player]=health
        localStorage.setItem("health", JSON.stringify(healthValue))
        
      }
      function playerHealth(player,playerHealthValue) {
        let health = 100;
        switch (playerHealthValue) {
          case 1:
            health = 75
            setHealthValue(player, health);
            console.log(health)
            break
          case 2:
            health = 50
            setHealthValue(player, health);
            console.log(health)
            break
          case 3:
            health = 25
            setHealthValue(player, health);
            console.log(health)
            break
          case 4:
            health = 0
            setHealthValue(player, health);
            console.log(health)
            break
        }
      }

      function userWins() {
        $("#character1").transition("vertical flip");
        $("#character1").transition("vertical flip");
        userCounter++;
        playerHealth("userHealth", userCounter);
        if (userCounter == 4) {
        }
      }

      function computerWins() {
        $("#character2").transition("vertical flip");
        $("#character2").transition("vertical flip");
        computerCounter++;
        playerHealth("cpuHealth", userCounter);
        if (computerCounter == 4) {
          $("#mainGameScreen").addClass("display");
          $("#finalScore").removeClass("display");
        }
      }

      function tiePoint() {
        $("#character1").transition("vertical flip");
        $("#character2").transition("vertical flip");
        $("#character1").transition("vertical flip");
        $("#character2").transition("vertical flip");
      }

      //Generates the the ajax calls
      function generateAjaxOptions(universe, randomCharacterId) {
        let url;
        if (universe === "superhero") {
          url = SUPERHERO_URL;
        } else if (universe === "pokemon") {
          url = POKEMON_URL;
        } else {
          //ERROR HANDLING
        }
        const ajaxOptions = {
          url: CORS_ANYWHERE_URL + url + randomCharacterId,
          method: "GET",
          dataType: "json",
          headers: {
            "x-requested-with": "xhr",
          },
        };
        return ajaxOptions;
      }

      function getRandomCharactersFromApi() {
        //Empty previous characters
        $("#character1").empty();
        $("#character2").empty();
        
        $("#healthBar").empty("")
        
        //Stores the random character ID into randomCharacterId's for a given universe
        const randomCharacterId1 = getRandomCharacterNumber(universe);
        const randomCharacterId2 = getRandomCharacterNumber(universe);
        $.ajax(generateAjaxOptions(universe, randomCharacterId1)).then(
          renderFirstCharacter
        );
        $.ajax(generateAjaxOptions(universe, randomCharacterId2)).then(
          renderSecondCharacter
        );
      }
      healthInLocalStorage(100,100)
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

      if (userPlayerHealth === 0) {
        $("#display").removeClass("display");
      }

      // Local Storage
      let score;
      function saveScore() {
        const scoreSaveInput = $("#scoreSaveInput");
        addToLocalStorage(scoreSaveInput, score);
      }
      $("#scoreSaveButton").on("click", saveScore);

      function addToLocalStorage(name, score) {
        let oldScoreFromLocalStorage = JSON.parse(
          localStorage.getItem("scores")
        );
        if (oldScoreFromLocalStorage === null) {
          const scoresInLocalStorage = [
            {
              name: name,
              score: score,
            },
          ];
          localStorage.setItem("scores", JSON.stringify(scoresInLocalStorage));
        } else {
          oldScoreFromLocalStorage.push([
            {
              name: name,
              score: score,
            },
          ]);
          localStorage.setItem(
            "scores",
            JSON.stringify(oldScoreFromLocalStorage)
          );
        }
      }

      function getFromLocalStorage() {
        const scoresFromLocalStorage = JSON.parse(
          localStorage.getItem("scores")
        );
        //Append onto the screen
        const listElement = $("<li>").text(
          scoresInLocalStorage.name + " " + scoresInLocalStorage.score
        );
        $("ulElementOnViewScreen").append(listElement);
      }