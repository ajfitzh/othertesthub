let gruntCounter = 0;
let playerTurn = true;

let enemiesList = [
    {
        id: 1,
        name: "Vlomdinir Prootim",
        weapon: "Propaganda",
        image_source: "/assets/storylineassets/badguy1.jpg",
        hp: 20,
        maxHp: 20,
        level: 1
    },
    {
        id: 2,
        name: "Igor SkullCrusher",
        weapon: "Badassery",
        image_source: "/assets/storylineassets/badguy2.jpg",
        hp: 80,
        maxHp: 80,
        level: 1
    },
    {
        id: 3,
        name: "Traitor Hulk Hogan",
        weapon: "Traitorousness",
        image_source: "/assets/storylineassets/badguy3.jpg",
        hp: 500,
        maxHp: 500,
        level: 1
    },
    {
        id: 4,
        name: "Voldemort Putin",
        weapon: "Evil",
        image_source: "/assets/storylineassets/badguy4.jpg",
        hp: 400,
        maxHp: 500,
        level: 1
    },
    {
        id: 5,
        name: "Double Agent Jimson",
        weapon: "Treachery",
        image_source: "/assets/storylineassets/badguy5.jpg",
        hp: 400,
        maxHp: 500,
        level: 1
    },
    {
        id: 6,
        name: "Chris Rock",
        weapon: "Laughter",
        image_source: "/assets/storylineassets/badguy6.jpg",
        hp: 400,
        maxHp: 500,
        level: 1
    },
    {
        id: 7,
        name: "Predator",
        weapon: "Alien Stuff",
        image_source: "/assets/storylineassets/badguy7.jpg",
        hp: 400,
        maxHp: 500,
        level: 10
    },
    {
        id: 8,
        name: "Orc Putin",
        weapon: "Orcish Stuff",
        image_source: "/assets/storylineassets/badguy8.jpg",
        hp: 400,
        maxHp: 500,
        level: 1
    },
    {
        id: 9,
        name: "Sub-Zero",
        weapon: "Ice Stuff",
        image_source: "/assets/storylineassets/badguy4.jpg",
        hp: 1500,
        maxHp: 1500,
        level: 30
    }
]

let isGameRunning = false;
let turnsLog = 0;
let currentEnemy = enemiesList[0];
let enemyCounter = 0;



document.addEventListener('DOMContentLoaded', function(){
    let startUpSound = new Audio("")
    startUpSound.play();
    fetch("http://localhost:3000/scores")
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
        debugger;
        document.querySelector('#fronttopscore').innerHTML ="";
        bblSort(data,"Enemies_killed");
        for(i=0;i<9;i++){
        let li = document.createElement('ol'); 
        li.innerText = `${[i+1]}. ${data[i].Name} ------------- ${data[i].Enemies_killed} `;
        
        document.querySelector('#fronttopscore').appendChild(li);  
        }
    })
    newFighter.addEventListener('submit', e => {
        e.preventDefault();
        let btnAudio = new Audio('/assets/sounds/navigatemenu3.wav')
        btnAudio.volume = 0.4;
        btnAudio.play();
        // let soundtrack = new Audio("/assets/soundtrack.mp3");
        // soundtrack.volume = 0.05;
        // soundtrack.play();
        console.log(e.target.name.value);
        let heroName = e.target.name.value;
        storylineName = e.target.name.value;
        console.log(e.target.selectWeapon.value)
        let heroWeapon = e.target.selectWeapon.value;
        setHeroInfo(heroName, heroWeapon);
        newFighter.reset();
        document.querySelector('#container').innerHTML = "";
        newFetch();
        testStoryline();
        // runBattle(heroName,heroWeapon);
    })
})


let newFighter = document.querySelector('#new-fighter')



function runBattle(){
    let startAudio = new Audio('/assets/sounds/gamestart.wav')
    startAudio.volume = 0.9;
    startAudio.play();
    let container = document.querySelector('#container');
    //Consider fixing innerHTML vs. Index.html to simplify life
    console.log(currentEnemy)
    container.innerHTML =
    `<div class="herostats" id="herostats"></div>
        <p> --------------- </p>
    <div class="enemystats"id="enemystats"></div>
    <div class="battleoptions" id="battleoptions"></div>
    <div class="battleMessage" id ="battleMessage"> 
         <p> A hooded figure steps out from behind the arcade... </p> 
        </div>
    <div id="sports"></div>`



    let battleMenu = document.createElement('div');
    container.append(battleMenu);
    let battleMessage = document.createElement('div');
    drawStats();
    fetchData();
    newFetch();
    setTimeout(()=>startGame(),1000)
}


function fetchData(){
fetch("http://api.open-notify.org/astros.json")
.then(res => (res.json())
.then(data => {
    let random = getRandomValue(0,10);
    let randomPerson = data.people[random].name;
    setTimeout(function(){
        newMessage(`<strong>${randomPerson}</strong> sent me! Prepare for your doom!`)
    },1500);
    data.people[2].name
})
)}


function drawStats(){
    let herostats = document.querySelector('#herostats');
    herostats.innerHTML = ` <p> Your Hero's Name:<br></br> ${hero.name}  </p>
                            <img id="heropic" width="200" height="200" src= ${hero.image_source} >
                            <p> Your Hero's Weapon: ${hero.weapon}  </p>
                            <p>Hitpoints: ${hero.hp} / ${hero.maxHp} </p>
                            <p> <progress id="heroHealthBar" value=${hero.hp} max=${hero.maxHp}></progress> </p>
                            <p>Level: ${hero.level}</p>
                            `
    let enemystats = document.querySelector('#enemystats');
    enemystats.innerHTML = `                       
                            <p> Enemy:<br></br> ${currentEnemy.name}  </p>
                            <img id="enemypic"  width="200" height="200" src= ${currentEnemy.image_source} >
                            <p> The Enemy's Weapon: ${currentEnemy.weapon}  </p>
                            <p>Hitpoints: ${currentEnemy.hp} / ${currentEnemy.maxHp} </p>
                            <p> <progress id="enemyHealthBar" value=${currentEnemy.hp} max= ${currentEnemy.maxHp}></progress> </p>
                            <p>Level: ${currentEnemy.level}</p>`
    let battleoptions = document.querySelector('#battleoptions');
    battleoptions.innerHTML = ` <div>                       
                            
                                <button id="attack" @click="attack">ATTACK</button>
                                <button id="special-attack" @click="attackSpecial">KICKPUNCH</button>
                                <button id="heal" @click="heal">EAT BURGER</button>
                                <button id="give-up" @click="giveUp">GIVE UP</button>
                            </div>
                            `
                        }


function newMessage(text){
    let newspace = document.createElement('p');
    newspace.innerHTML = "";
    let li = document.createElement('span');
    li.innerHTML = text;
    document.querySelector('#battleMessage').prepend(newspace)
    document.querySelector('#battleMessage').prepend(li);
    console.log(text);
}


function setHeroInfo(text,weapon){
    hero.name = text;
    hero.weapon = weapon;
}
///Build stats of Hero and Enemy as Objects
const hero = {
    name: "Edwin",
    weapon: "Butterknife",
    image_source: "/assets/storylineassets/KickPuncher.jpg",
    hp: 50,
    maxHp:50,
    level: 1
}

///Trying to fit in other code

function startGame (){
    console.log("startGame has started!");    
    isGameRunning = true;
        resetGame();
        listeningState();
    }

function listeningState(){
    const attackarea = document.querySelector('#attack')
    attackarea.addEventListener('click',attack);
    const specialarea = document.querySelector('#special-attack')
    specialarea.addEventListener('click',specialAttack);
    const healarea = document.querySelector('#heal')
    healarea.addEventListener('click',heal);
    const giveuparea = document.querySelector('#give-up')
    giveuparea.addEventListener('click',giveUp);
    
    const heropicture = document.querySelector('#heropic')
    attackarea.addEventListener('click', function(){
        heropicture.addClass('shake');
        })
    }

function attack () {
    let attackAudio = new Audio('/assets/sounds/explosion4.wav')
    attackAudio.volume = 0.3;
    let reactionAudio = new Audio('/assets/sounds/hit3.wav')
    reactionAudio.volume = 0.8;
    attackAudio.play();
    reactionAudio.play();
    playerTurn=false;
    
        //make random value generator
        console.log("Attack is Run")
        let damage = getRandomValue(2,8);
        currentEnemy.hp -= damage;
        newMessage(`Player inflicted <font color ="red">${damage}</font> damage! All right!`);
        handleGameOver();

}

function specialAttack () {
    console.log('is special attack called?')
    let attackAudio = new Audio('/assets/sounds/explosion1.wav')
    attackAudio.volume = 0.6;
    let reactionAudio = new Audio('/assets/sounds/hit3.wav')
    reactionAudio.volume = 0.3;
    attackAudio.play();
    reactionAudio.play();
    playerTurn=false;
    if(isGameRunning === true){
        //make random value generator
        console.log("Special KickPunch Attack")
        let damage = getRandomValue(1000,2000);
        currentEnemy.hp -= damage;
        newMessage(`Player inflicted <font color ="red">${damage}</font> damage! So cool!`);
        handleGameOver();
    }
}
function heal () {
    console.log('Is Heal called?')
    let eatAudio = new Audio('/assets/sounds/pickup0.wav')
    eatAudio.volume = 0.6;
    let healingAudio = new Audio('/assets/sounds/start.wav')
    healingAudio.volume = 0.3;
    eatAudio.play();
    healingAudio.play();
    playerTurn=false;
    if(isGameRunning === true){
        //make random value generator
        console.log("You eat an American Burger. Oo-Rah!")
        let heal = 20;
        hero.hp += heal;
        if(hero.hp > hero.maxHp) {
            hero.hp = hero.maxHp;
        }
        newMessage(`Player ate burger and healed <font color ="green">${heal}</font> health points! America, <strong>oh yeah!</strong>`);
        handleGameOver();
    }
}
function giveUp () {
    console.log('is giveup called?')
    let reactionAudio = new Audio('/assets/sounds/lose0.wav')
    reactionAudio.volume = 0.8;
    reactionAudio.play();
    isGameRunning = false;
    resetGame();
    newMessage(`You run away.`);
    highScore();
}

function handleTurnMonster(){
    if(isGameRunning === true){
        //add randomizer function
        handleMonsterAudio();
        let damage = setTimeout(function(){
            getRandomValue(3,10);
        }, 5000);
        hero.hp -= damage;
        newMessage(`${currentEnemy.name} inflicted <font color ="red">${damage}</font> damage!`);
    }
    playerTurn=true;
    handleGameOver();
    drawStats();
    listeningState();
}

function getRandomValue(min,max) {
    return Math.max(Math.floor(Math.random() * max) + 1,min);
}

function handleGameOver(){
    if(currentEnemy.hp <= 0) {
        setTimeout(function(){
            let reactionAudio = new Audio('/assets/sounds/badguydeath.mp3')
            reactionAudio.volume = 1;
            reactionAudio.play();
            newMessage('Victory! This Agent is eliminated!');
        }, 1000);
        isGameRunning = false;
        gruntCounter = 0;
        setTimeout(function() {
            newBadGuy();
            listeningState()
            startGame()}
            ,1000)
    }
    else if(hero.hp <=0) {

        setTimeout(function(){
        let losingAudio = new Audio('./assets/sounds/lose0.wav')
        losingAudio.volume = 0.5;
        losingAudio.play();
        newMessage('Defeat! You have failed all of America and Ronald Reagan!');
        isGameRunning = false;
        highScore(); 
        }, 1000);
        
    }
    
    if(playerTurn === false){
        setTimeout(function(){
            handleTurnMonster();
        }, 1000);
    }

}

function resetGame(){
    // hero.hp = hero.maxHp;
    currentEnemy.hp = currentEnemy.maxHp;
}

function newBadGuy(){
    if(enemyCounter === 9) {
        highScore();
    }else{
        setTimeout(function(){
        let startAudio = new Audio('/assets/sounds/enemyentry.wav')
        startAudio.volume = 0.9;
        startAudio.play();
        }, 2000)
        enemyCounter++;
        currentEnemy = enemiesList[enemyCounter];
        console.log("switching to new bad guy");
        console.log(currentEnemy)
        setTimeout(function(){
            drawStats();
            newMessage(`                               `);
            newMessage(`A new challenger approaches... `);
            newMessage(`${currentEnemy.name}! What a jerk!`)
        }, 2000)
        debugger;
        setTimeout(function(){startGame();},3000)
    listeningState();
}
}
//////////////////////////////////////////////////////High Score Area///////////////////////////
function highScore(){
    console.log(`You successfully killed: ${enemyCounter} enemies of America.`)
    // submitData(hero.name,enemyCounter);
    container.innerHTML = `
                            <span> ------HIGH SCORE------ </span>
                            <br></br>
                            <span> Name    Enemies Killed </span>
                            <ol class= "numbers" id="topscore"></ol>
                            
                            <p>You successfully killed:<strong> ${enemyCounter} enemies of America.</strong> Enter your initials below to save your score. Reload Page to Try Again!</p>
                            <form id="highscoresurvey">
                            <form action="http://localhost:3000/" method="POST" >
                            <label> Your Initials: <input type="text" name="initials" id="initials" /></label
                            ><br />
                            <input type="submit" onClick= "playSound()"id="submit" value="Submit" />
                            </form>
                            `

    fetchHighScores();

let form = document.getElementById('highscoresurvey');
console.log(form)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.preventDefault());
    debugger; 
    let initial = e.target.initials.value;
    console.log(initial)
    debugger;
    submitData(initial,enemyCounter);
    highScore();
    // window.onbeforeunload = function(){
    //     return "string";
    
});
}


function fetchHighScores() {

    debugger;
    fetch("http://localhost:3000/scores")
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
        debugger;
        document.querySelector('#topscore').innerHTML ="";
        bblSort(data,"Enemies_killed");
        for(i=0;i<9;i++){
           let li = document.createElement('ol'); 
         li.innerText = `${[i+1]} ${data[i].Name} ------- ${data[i].Enemies_killed} `;
         
         document.querySelector('#topscore').append(li);  
        }
    })
}


function submitData(initial,EnemyCounter){
    const formData={
      Name:initial,
      Enemies_killed: EnemyCounter  
    };
    const configurationObject = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify (formData),
};
debugger;
fetch("http://localhost:3000/scores",configurationObject);
}

//Sleep function from tutorial
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  function handleMonsterAudio(){
                  //Grunt's response!
                // if(gruntCounter === 0 && currentEnemy.id === 1){
                //     let audioKGB = new Audio('/assets/sounds/explosion0.wav');
                //     audioKGB.volume = 0.5;    
                //     audioKGB.play();
                //     gruntCounter++;
                //     let audioAK = new Audio(randomFightAudio());
                //     audioAK.volume = 0.1;
                //     setTimeout(function(){audioAK.play();},3500)
                // }
                // else if(gruntCounter === 0 && currentEnemy.id === 2){
                //     let audioKGB = new Audio('/assets/achievement0.wav');
                //     audioKGB.volume = 0.1;    
                //     audioKGB.play();
                //     gruntCounter++; 
                //     let audioAK = new Audio(randomFightAudio());
                //     audioAK.volume = 0.9;
                //     setTimeout(function(){audioAK.play()},3500)
                // }
                // else {
                let audioFight = new Audio(randomFightAudio());
                audioFight.volume = 0.5;
                audioFight.play()
                // }
}

const sounds = [
    "./assets/sounds/shoot0.wav",
    "./assets/sounds/shoot1.wav",
    "./assets/sounds/shoot2.wav",
    "./assets/sounds/shoot3.wav"
]
function randomFightAudio(){
    let hitSound = Math.floor(Math.random() * 3) + 1;//Make random value generator for sound FX array
    return sounds[hitSound]
}

///BubbleSort with help from GeeksforGeeks.com tutorial for function 
function bblSort(a, par)
{
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i][par] < a[i + 1][par]) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}
