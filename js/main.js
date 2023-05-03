'use strict'

window.addEventListener('load', () => {

    // ######################
    // # Variables globales #
    // ######################

    // Constantes du monstre
    const maxLife = 100
    const sleepDuration = 7
    const randomDelay = 12

    const maxRest = 100
    const maxHunger = 100

    // Attributs du monstre
    let name = ''
    let life = maxLife
    let money = 0
    let awake = true

    // Attributs du monstre (ajoutés)
    let rest = maxRest
    let hunger = maxHunger

    let timeout

    // Méthodes du monstre
    let run = document.getElementById('b2')
    let fight = document.getElementById('b3')
    let work = document.getElementById('b7')
    let sleep = document.getElementById('b4')
    let eat = document.getElementById('b5')
    let show = document.getElementById('b6')

    let newLife = document.getElementById('b1')
    let kill = document.getElementById('k')
    let theme = document.getElementById('theme')

    // Composants du fichier html
    let actionBox = document.getElementById('actionbox')

    let statsLife = document.getElementById('life')
    let statsMoney = document.getElementById('money')
    let statsAwake = document.getElementById('awake')
    let statsRest = document.getElementById('rest')
    let statsHunger = document.getElementById('hunger')

    let monster = document.getElementById('monster')

    let healthBar = document.getElementById('health-bar')
    let restBar = document.getElementById('rest-bar')
    let hungerBar = document.getElementById('hunger-bar')

    let body = document.getElementsByTagName('body')[0]

    // Liste des actions du monstre
    const actions = [
        runAction,
        fightAction, 
        workAction, 
        sleepAction, 
        eatAction
    ]

    // #########################
    // # Fonctions principales #
    // #########################

    /**
     * Initialise les attributs du monstre
     * @param {string} n nom du monstre
     * @param {number} l vie du monstre
     * @param {number} m argent du monstre
     * @param {number} r energie du monstre
     * @param {number} h faim du monstre
     */
    function init(n, l, m, r, h) {
        name = n
        life = l
        money = m
        rest = r
        hunger = h
    }

    /**
     * Affiche les attributs du monstre dans la boite d'action
     */
    function showme(){
        let emoji = '❌'
        if(isAwake())
            emoji = '✅'

        log(`❤️: ${life}/${maxLife} | 💰: ${money} | Awake : ${emoji} | 💤: ${rest}/${maxRest} | 🍗: ${hunger}/${maxHunger}`)
    }

    /**
     * Méthode principale
     */
    function go(){
        assignActions()

        let nameMonster = nameTheMonster('Quel est le nom de votre monstre ?')

        while(nameMonster === '')
            nameMonster = nameTheMonster('Le nom de votre monstre doit faire moins de 10 caractères.\nQuel est le nom de votre monstre ?')

        init(nameMonster, maxLife, 0, maxRest, maxHunger)

        monster.children[1].innerHTML = nameMonster
        healthBar.max = maxLife
        restBar.max = maxRest
        hungerBar.max = maxHunger

        displayStatus(life, money, awake, rest, hunger)

        // Exécution de la fonction aléatoire toutes les 12 secondes
        setInterval(hasard, randomDelay * 1000)
    }

    /**
     * Affiche un message dans la boite d'action
     * @param {string} message message à afficher dans la boite d'action
     */
    function log(message){
        let p = document.createElement('p')
        p.innerHTML = message
        actionBox.insertBefore(p, actionBox.firstChild)
    }
    
    /**
     * Affiche les attributs du monstre dans la boite de status
     * @param {number} life vie du monstre
     * @param {number} money argent du monstre
     * @param {boolean} awake etat du monstre
     * @param {number} rest energie du monstre
     * @param {number} hunger faim du monstre
     */
    function displayStatus(life, money, awake, rest, hunger){
        // Reset la couleur de la barre de vie
        healthBar.className = ''

        // Change la couleur et l'emoji du monstre en fonction de sa vie
        if(life <= 0){
            updateStatus('', '💀')
            log(`${name} est mort`)
            awake = true
        }
        else if(life <= maxLife * 0.1)
            updateStatus('progress-dark-red', '😰')
        else if(life <= maxLife * 0.2)
            updateStatus('progress-red', '😨')
        else if(life <= maxLife * 0.4)
            updateStatus('progress-dark-orange', '😟')
        else if(life <= maxLife * 0.5)
            updateStatus('progress-orange', '☹️')
        else if(life <= maxLife * 0.6)
            updateStatus('progress-yellow', '😐')
        else if(life <= maxLife * 0.8)
            updateStatus('progress-light-green', '🙂')
        else
            updateStatus('progress-green', '😃')

        // Affiche les attributs du monstre dans la boite de status
        healthBar.value = life
        statsMoney.textContent = `💰: ${money}`
        restBar.value = rest
        hungerBar.value = hunger
        
        if(!isAwake() && isAlive())
            statsAwake.textContent = `😴`

        // Epaisseur de la bordure du monstre en fonction de l'argent
        monster.style.borderWidth = `${money / 2}px`
        if(money < 2)
            monster.style.borderWidth = '1px'
    }

    // #######################
    // # Fonctions rajoutées #
    // #######################

    /**
     * Permet de donner un nom au monstre
     * @param {string} message message à afficher dans la boite de dialogue
     * @returns {string} le nom du monstre entré par l'utilisateur ou 'Monster' si le nom est vide
     */
    function nameTheMonster(message){
        let nameMonster = prompt(message)
        
        // Vérifie si le nom du monstre n'est pas vide et ne contient pas que des espaces
        if(nameMonster !== null && nameMonster.trim() !== '' && nameMonster.length <= 10)
            return nameMonster
        else if(nameMonster !== null && nameMonster.trim() !== '' && nameMonster.length > 10)
            return ''
        else
            return 'Le monstre'
    }

    /**
     * Assigne les actions aux boutons correspondants
     */
    function assignActions(){
        run.addEventListener('click', runAction)
        fight.addEventListener('click', fightAction)
        work.addEventListener('click', workAction)
        sleep.addEventListener('click', sleepAction)
        eat.addEventListener('click', eatAction)
        show.addEventListener('click', showme)

        newLife.addEventListener('click', newLifeAction)
        kill.addEventListener('click', killAction)
        theme.addEventListener('click', changeTheme)
    }

    /**
     * Met à jour la boite de status
     * @param {string} className nom de la classe de la barre de vie
     * @param {string} emoji emoji à afficher dans la boite de status
     */
    function updateStatus(className, emoji){
        healthBar.className = className
        statsAwake.textContent = emoji
    }

    /**
     * Change le thème du site
     */
    function changeTheme(){
        body.classList.toggle('dark-theme')
        theme.classList.toggle('light')
        theme.classList.toggle('dark')
    }

    // ###################################
    // # Méthodes des actions du monstre #
    // ###################################

    /**
     * Permet de savoir si le monstre est en vie
     * @returns {boolean} true si le monstre est en vie, false sinon
     */
    function isAlive(){
        return life > 0
    }

    /**
     * Permet de savoir si le monstre est éveillé
     * @returns {boolean} true si le monstre est éveillé, false sinon
     */
    function isAwake(){
        return awake
    }

    /**
     * Permet de savoir si le monstre a assez d'argent
     * @param {number} amount montant à vérifier
     * @returns {boolean} true si le monstre a assez d'argent, false sinon
     */
    function haveEnoughMoney(amount){
        return money >= amount
    }

    /**
     * Permet de savoir si le monstre a assez de vie
     * @param {number} amount montant à vérifier
     * @returns {boolean} true si le monstre a assez de vie, false sinon
     */
    function haveEnoughLife(amount){
        return life >= amount
    }

    /**
     * Permet de savoir si le monstre a assez de repos
     * @param {number} amount montant à vérifier
     * @returns true si le monstre a assez de repos, false sinon
     */
    function haveEnoughRest(amount){
        return rest >= amount
    }

    /**
     * Permet de savoir si le monstre a assez de faim
     * @param {number} amount montant à vérifier
     * @returns true si le monstre a assez de faim, false sinon
     */
    function haveEnoughHunger(amount){
        return hunger >= amount
    }

    /**
     * Permet de savoir si le monstre peut faire une action
     * @param {number} lifeAmount montant des pv à vérifier
     * @param {number} restAmount montant du repos à vérifier
     * @param {number} hungerAmount montant de la faim à vérifier
     * @param {number} priceAmount montant du prix à vérifier 
     * @returns {boolean} true si le monstre peut faire l'action, false sinon
     */
    function canDoAction(lifeAmount, restAmount, hungerAmount, priceAmount){
        let canDo = false

        if(!isAlive())
            log(`${name} est mort`)
        else if(!isAwake())
            log(`${name} est endormi`)
        else if(!haveEnoughLife(lifeAmount))
            log(`${name} n'a plus assez de vie pour faire cette action`)
        else if(!haveEnoughRest(restAmount))
            log(`${name} est trop fatigué pour faire cette action`)
        else if(!haveEnoughHunger(hungerAmount))
            log(`${name} est trop affamé pour faire cette action`)
        else if(!haveEnoughMoney(priceAmount))
            log(`${name} n'a plus assez d'argent pour faire cette action`)
        else
            canDo = true

        return canDo
    }

    /**
     * Soigne le monstre de la valeur passée en paramètre sans dépasser la vie max
     * @param {number} amount nombre de pv à ajouter au monstre
     */
    function heal(amount){
        life += amount
        if(life > maxLife)
            life = maxLife
        else if(life < 0)
            life = 0

        healthBar.value = life
    }

    /**
     * Permet au monstre de se reposer
     * @param {number} amount nombre de repos à ajouter au monstre
     */
    function repose(amount){
        rest += amount
        if(rest > maxRest)
            rest = maxRest
        else if(rest < 0)
            rest = 0

        restBar.value = rest

        // Fait perdre de la vie au monstre si il n'a plus d'énergie
        if(rest <= 0){
            heal(-5)
            log(`${name} n'a plus d'énergie 💤 [-5 ❤️]`)
        }
    }

    /**
     * Permet au monstre de manger
     * @param {number} amount nombre de faim à ajouter au monstre
     */
    function eatFood(amount){
        hunger += amount
        if(hunger > maxHunger)
            hunger = maxHunger
        else if(hunger < 0)
            hunger = 0

        hungerBar.value = hunger

        // Fait perdre de la vie au monstre si il meurt de faim
        if(hunger <= 0){
            heal(-5)
            log(`${name} meurt de faim 🍗 [-5 ❤️]`)
        }
    }

    /**
     * Fait courir le monstre
     * Fait perdre 1 de vie au monstre
     * Fait perdre 1 de repos au monstre
     * Fait perdre 1 de faim au monstre
     */
    function runAction(){
        if(!canDoAction(1, 1, 1, 0))
            return
        
        log(`${name} court [-1 ❤️ | -1 🍗 | -1 💤]`)
        heal(-1)
        eatFood(-1)
        repose(-1)
        displayStatus(life, money, awake, rest, hunger)
    }

    /**
     * Fait combattre le monstre
     * Fait perdre 3 de vie au monstre
     * Fait perdre 2 de repos au monstre
     * Fait perdre 1 de faim au monstre
     */
    function fightAction(){
        if(!canDoAction(3, 2, 1, 0))
            return

        log(`${name} combat [-3 ❤️ | -1 🍗| -2 💤]`)
        heal(-3)
        eatFood(-1)
        repose(-2)
        displayStatus(life, money, awake, rest, hunger)
    }

    /**
     * Fait travailler le monstre
     * Fait gagner 2 d'argent au monstre et lui fait perdre 1 de vie
     * Fait perdre 4 de repos au monstre
     * Fait perdre 2 de faim au monstre
     */
    function workAction(){
        if(!canDoAction(1, 4, 2, 0))
            return

        log(`${name} travaille [-1 ❤️ | +2 💰 | -2 🍗| -4 💤]`)
        heal(-1)
        eatFood(-2)
        repose(-4)
        money += 2
        displayStatus(life, money, awake, rest, hunger)
    }

    /**
     * Fait manger le monstre
     * Fait gagner 2 de vie au monstre et lui fait perdre 3 d'argent
     * Fait gagner 1 de repos au monstre
     * Fait gagner 5 de faim au monstre
     */
    function eatAction(){
        if(!canDoAction(0, 0, 0,3))
            return

        log(`${name} mange [+2 ❤️ | -3 💰 | +5 🍗 | +1 💤]`)
        heal(2)
        eatFood(5)
        repose(1)
        money -= 3
        displayStatus(life, money, awake, rest, hunger)
    }

    /**
     * Réveille le monstre
     * Fait gagner 1 de vie au monstre
     * Fait gagner 10 de repos au monstre
     */
    function awakeAction(){
        // Empêche le monstre de réscuciter si il est tué pendant son sommeil
        if(!isAlive()){
            awake = true
            return
        }

        log(`${name} se réveille [+1 ❤️ | +10 💤]`)
        heal(1)
        repose(10)
        awake = true
        displayStatus(life, money, awake, rest, hunger)
    }

    /**
     * Fait dormir le monstre pendant 7 secondes
     */
    function sleepAction(){
        if(!canDoAction(0, 0, 0, 0))
            return

        awake = false
        log(`${name} dort`)
        displayStatus(life, money, awake, rest, hunger)

        timeout = setTimeout(awakeAction, sleepDuration * 1000)
    }

    /**
     * Donne une nouvelle vie au monstre s'il est mort
     */
    function newLifeAction(){
        if(isAlive()){
            log(`${name} n'est pas mort`)
            return
        }
        
        init(name, maxLife, 0, maxRest, maxHunger)
        log(`${name} a trouvé une nouvelle vie`)
        displayStatus(life, money, awake, rest, hunger)
    }

    /**
     * Tue le monstre
     */
    function killAction(){
        if(!isAlive()){
            log(`${name} est déjà mort`)
            return
        }

        // Empêche le monstre de réscuciter si il est tué pendant son sommeil
        clearTimeout(timeout)
        heal(-life)
        awake = true
        displayStatus(life, money, awake, rest, hunger)
    }

    // ######################
    // # Fonction aléatoire #
    // ######################

    /**
     * Fait une action aléatoire
     */
    function hasard(){
        // Empêche le monstre de faire une action aléatoire si il est mort
        if(!isAlive())
            return

        let rand = Math.floor(Math.random() * actions.length)

        actions[rand]()
    }

    // ####################
    // # Lancement du jeu #
    // ####################

    go()
})