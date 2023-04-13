'use strict'

window.addEventListener('load', function() {

    // ######################
    // # Variables globales #
    // ######################

    // Attributs du monstre
    let name = ''
    let life = 100
    let maxLife = 100
    let money = 0
    let awake = true

    // Méthodes du monstre
    let run = document.getElementById('b2')
    let fight = document.getElementById('b3')
    let work = document.getElementById('b7')
    let sleep = document.getElementById('b4')
    let eat = document.getElementById('b5')
    let show = document.getElementById('b6')

    let newLife = document.getElementById('b1')
    let kill = document.getElementById('k')

    // Composants du fichier html
    let actionBox = document.getElementById('actionbox')
    let status = document.getElementById('status')
    let monster = document.getElementById('monster')

    // Liste des actions du monstre
    let actions = [
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
     */
    function init(n, l, m) {
        name = n
        life = l
        money = m
    }

    /**
     * Affiche les attributs du monstre dans la boite d'action
     */
    function showme(){
        log(`Life : ${life} / Money : ${money} / Awake : ${awake}`)
        // displayStatus(life, money, awake)
    }

    /**
     * Permet de donner un nom au monstre
     * @returns {string} le nom du monstre entré par l'utilisateur ou 'Monster' si le nom est vide
     */
    function nameTheMonster(){
        let nameMonster = prompt('Quel est le nom de votre monstre ?')
        
        // Vérifie si le nom du monstre n'est pas vide et ne contient pas que des espaces
        if(nameMonster !== null && nameMonster.trim() !== '')
            return nameMonster
        else
            return 'Le monstre'
    }

    /**
     * Méthode principale
     */
    function go(){
        let nameMonster = nameTheMonster()
        init(nameMonster, maxLife, 0)
        monster.firstElementChild.innerHTML = nameMonster
        show.addEventListener('click', showme)
        displayStatus(life, money, awake)
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
     */
    function displayStatus(life, money, awake){
        let emoji = ''

        // Change la couleur et l'emoji du monstre en fonction de la vie
        if(life <= 0){
            monster.style.backgroundColor = '#555555'
            emoji = '💀'
        }
        else if(life <= 5){
            monster.style.backgroundColor = '#aa0000'
            emoji = '😡'
        }
        else if(life <= 20){
            monster.style.backgroundColor = '#ff0000'
            emoji = '😠'
        }
        else if(life <= 35){
            monster.style.backgroundColor = '#ff5500'
            emoji = '☹️'
        }
        else if(life <= 50){
            monster.style.backgroundColor = '#ffaa00'
            emoji = '😥'
        }
        else if(life <= 65){
            monster.style.backgroundColor = '#ffff00'
            emoji = '😐'
        }
        else if(life <= 80){
            monster.style.backgroundColor = '#aaff00'
            emoji = '🙂'
        }
        else{
            monster.style.backgroundColor = '#00ff00'
            emoji = '😃'
        }

        // Affiche les attributs du monstre dans la boite de status
        status.children[0].innerHTML = `❤️: ${life}/${maxLife}`
        status.children[1].innerHTML = `💰: ${money}`
        if(!awake)
            status.children[2].innerHTML = `😴`
        else
            status.children[2].innerHTML = emoji

        // Epaisseur de la bordure du monstre en fonction de argent
        monster.style.borderWidth = `${money / 10}px`
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
     * @param {number} amount 
     * @returns {boolean} true si le monstre a assez de vie, false sinon
     */
    function haveEnoughLife(amount){
        return life > amount
    }

    /**
     * Permet de savoir si le monstre peut faire une action
     * @param {number} lifeAmount montant des pv à vérifier
     * @param {number} priceAmount montant du prix à vérifier 
     * @returns {boolean} true si le monstre peut faire l'action, false sinon
     */
    function canDoAction(lifeAmount, priceAmount){
        let canDo = true

        if(!isAlive()){
            log(`${name} n'a plus assez de vie pour faire cette action`)
            canDo = false
        }
        else if(!isAwake()){
            log(`${name} est endormi`)
            canDo = false
        }
        else if(!haveEnoughLife(lifeAmount)){
            log(`${name} n'a plus assez de vie pour faire cette action`)
            canDo = false
        }
        else if(!haveEnoughMoney(priceAmount)){
            log(`${name} n'a plus assez d'argent pour faire cette action`)
            canDo = false
        }

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
    }

    /**
     * Fait courir le monstre
     * Fait perdre 1 de vie au monstre
     */
    function runAction(){
        if(!canDoAction(1, 0))
            return
        
        heal(-1)
        log(`${name} court [-1 ❤️]`)
        displayStatus(life, money, awake)
    }

    /**
     * Fait combattre le monstre
     * Fait perdre 3 de vie au monstre
     */
    function fightAction(){
        if(!canDoAction(3, 0))
            return

        heal(-3)
        log(`${name} combat [-3 ❤️]`)
        displayStatus(life, money, awake)
    }

    /**
     * Fait travailler le monstre
     * Fait gagner 2 d'argent au monstre et lui fait perdre 1 de vie
     */
    function workAction(){
        if(!canDoAction(1, 0))
            return

        heal(-1)
        money += 2
        log(`${name} travaille [-1 ❤️ | +2 💰]`)
        displayStatus(life, money, awake)
    }

    /**
     * Fait manger le monstre
     * Fait gagner 2 de vie au monstre et lui fait perdre 3 d'argent
     */
    function eatAction(){
        if(!canDoAction(0, 3))
            return

        heal(2)
        money -= 3
        log(`${name} mange [+2 ❤️ | -3 💰]`)
        displayStatus(life, money, awake)
    }

    /**
     * Réveille le monstre
     * Fait gagner 1 de vie au monstre
     */
    function awakeAction(){
        heal(1)
        awake = true
        log(`${name} se réveille [+1 ❤️]`)
        displayStatus(life, money, awake)
    }

    /**
     * Fait dormir le monstre pendant 7 secondes
     */
    function sleepAction(){
        if(!canDoAction(0, 0))
            return

        awake = false
        log(`${name} dort`)
        displayStatus(life, money, awake)

        setTimeout(awakeAction, 7000)
    }

    /**
     * Donne une nouvelle vie au monstre s'il est mort
     */
    function newLifeAction(){
        if(isAlive()){
            log(`${name} n'est pas mort`)
            return
        }
        
        init(name, maxLife, 0)
        log(`${name} a trouvé une nouvelle vie`)
        displayStatus(life, money, awake)
    }

    /**
     * Tue le monstre
     */
    function killAction(){
        life = 0
        log(`${name} est mort`)
        displayStatus(life, money, awake)
    }

    // ########################################
    // # Attribution des méthodes aux boutons #
    // ########################################

    run.addEventListener('click', runAction)
    fight.addEventListener('click', fightAction)
    work.addEventListener('click', workAction)
    sleep.addEventListener('click', sleepAction)
    eat.addEventListener('click', eatAction)

    newLife.addEventListener('click', newLifeAction)
    kill.addEventListener('click', killAction)

    // ######################
    // # Fonction aléatoire #
    // ######################

    /**
     * Fait une action aléatoire
     */
    function hasard(){
        let rand = Math.floor(Math.random() * actions.length)

        actions[rand]()
    }

    // Exécution de la fonction aléatoire toutes les 12 secondes
    setInterval(hasard, 12000)

    // ####################
    // # Lancement du jeu #
    // ####################

    go()
})