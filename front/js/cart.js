//***** Ajouter Produits du local storage dans le panier *****//
let addToLocalStorage = JSON.parse(localStorage.getItem("products"))
let cartArticle = ""

//***** Selection Element du DOM *****//
const cartItems = document.querySelector("#cart__items")
const totalQuantity = document.querySelector("#totalQuantity")

//***** Boucle "for" pour récupérer les données du local storage *****// 
if(addToLocalStorage !== 0) {
    for (let i = 0; i < addToLocalStorage.length ; i++){
        cartArticle += `
            <article class="cart__item" data-id="${addToLocalStorage[i]._id}" data-color="${addToLocalStorage[i].color}" data-quantity="${addToLocalStorage[i].quantity}" data-price="${addToLocalStorage[i].price}">
                <div class="cart__item__img">
                    <img src="${addToLocalStorage[i].imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${addToLocalStorage[i].name}</h2>
                        <p>${addToLocalStorage[i].color}</p>
                        <p>${addToLocalStorage[i].price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p> Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${addToLocalStorage[i].quantity}">
                        </div>
                            <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p> 
                        </div>
                    </div>
                </div>
            </article>
         `
        cartItems.innerHTML = cartArticle
    }
    editQuantity()
    totalProduct()
} 

//***** Fonction pour modifier dynamiquement les quantités du panier *****//
function editQuantity () {
    const cart = document.querySelectorAll(".cart__item")
    cart.forEach((cart) => {
        cart.addEventListener("change", (e) => {
            let cartList = JSON.parse(localStorage.getItem("products"))
            //Boucle pour modifier la quantité des artcicles du panier 
            for ( article of cartList) 
            if ( article._id === cart.dataset.id && cart.dataset.color === article.color) {
                article.quantity = e.target.value
                localStorage.setItem("products", JSON.stringify(cartList))
                //Mettre à jour le dataset de quantité
                cart.dataset.quantity = e.target.value
                //Cette fonction actualise les données 
                totalProduct ()
            }
        })
    })
}

//***** Fonction calcul du nombre total produit et coût total *****//
function totalProduct () {
    //Déclaration de la variable en tant que nombre
    let totalArticle = 0
    let totalPrice = 0
    // Pointer l'élément
    const cart = document.querySelectorAll(".cart__item")
    // Pour chaque élément cart
    cart.forEach((cart) =>  {
        // Récupération des quantités des articles grâce au dataset
        totalArticle += JSON.parse(cart.dataset.quantity)
        totalPrice += cart.dataset.quantity * cart.dataset.price
    })
    // Pointer l'endroit d'affichage du nombre d'article
    document.getElementById("totalQuantity").textContent = totalArticle
    // Pointer l'endroit d'affichage du prix total
    document.getElementById("totalPrice").textContent = totalPrice
}

//***** Fonction pour supprimer les articles *****//
deleteArticle()
function deleteArticle () {
    let deleteItem = document.querySelectorAll(".deleteItem")
    //Boucle for pour récupérer les données des boutons
    for ( let j = 0; j < deleteItem.length; j++){
        // Ecouter le clic de tous boutons [j]
        deleteItem[j].addEventListener ("click", (e) => {
            e.preventDefault()
            //Selectionner ID des articles dans le panier au clic
            let idSelectedProduct = addToLocalStorage[j]._id
            let colorSelectedProduct = addToLocalStorage[j].color
            // Methode filter selectionne les éléments à garder et supprime l'élément ou le btn a été cliqué
            addToLocalStorage = addToLocalStorage.filter(el => el._id !== idSelectedProduct || el.color !== colorSelectedProduct)
            //Envoie nouvelles données vers le local storage 
            localStorage.setItem("products", JSON.stringify(addToLocalStorage))
            window.location.href= "cart.html"
        })
    }
    //Affichage informatif
    if(addToLocalStorage == 0 || addToLocalStorage === null) {
        //Aucun article dans le panier création d'un H1 informatif
        const emptyCard = document.querySelector("h1")
        emptyCard.textContent = "Votre panier est vide" 
        //Cacher le formulaire
        const cartOrder = document.querySelector(".cart__order")
        cartOrder.style.display = "none"
    }
} 

//***** Gestion du formulaire *****//
//Sélectionner le bouton Valider
const btnSubmit = document.querySelector("#order")

//Écouter le bouton Valider sur le click pour pouvoir contrôler, valider et ennoyer le formulaire et les produits au back-end
btnSubmit.addEventListener("click", (e) => {
    e.preventDefault()

    let contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
      };
     
    //***** Regex pour le contrôle des champs Prénom, Nom et Ville *****//
    //Méthode .test pour vérifier la correspondance
    const regExNameCity = (value) => {
        return /^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(value)
    }

    //Regex pour le contrôle du champ Adresse
    const regExAddress = (value) => {
        return /[0-9,'a-zA-Zéèàêëï]/.test(value)
    } 

    //Regex pour le contrôle du champ Email
    const regExEmail = (value) => {
        return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(value)
    } 

    //Fonction en cas d'erreurs dans le formulaire
    function errorMsg (queryId) {
        document.querySelector(`#${queryId}`).textContent="Veuillez bien remplir ce champ"
    }

    function noErrorMsg (queryId) {
        document.querySelector(`#${queryId}`).textContent=""
    }

    function colorErrorMsg (colorId) {
        document.querySelector(`#${colorId}`).style.border="3px solid red"
    }

    function greenNoError (colorId) {
        document.querySelector(`#${colorId}`).style.border="3px solid green"
    }

    //Fonction de contrôle des valeurs du formulaire
    function firstNameControl() {
        const firstName = contact.firstName
        if (regExNameCity(firstName)) {
            greenNoError("firstName")
            return true
        }else{
            colorErrorMsg("firstName")
            return false
        }
    }

    function lastNameControl() {
        const lastName = contact.lastName
        if(regExNameCity(lastName)){
            greenNoError("lastName")
            return true
        }else{
            colorErrorMsg("lastName")
            return false
        }
    }

    function addressControl() {
        const address = contact.address
        if(regExAddress(address)) {
            greenNoError("address")
            return true
        }else{
            colorErrorMsg("address")
            return false
        }
    }

    function cityControl() {
        const city = contact.city
        if(regExNameCity(city)) {
            greenNoError("city")
            return true
        }else{
            colorErrorMsg("city")
            return false
        }
    }

    function emailControl() {
        const email = contact.email
        if(regExEmail(email)) {
            greenNoError("email")
            return true
        }else{
            colorErrorMsg("email")
            return false
        }
    }

    //Operateur ternaire pour afficher "Veuillez bien remplir ce champ" dans le formulaire
    firstNameControl() == true ? noErrorMsg("firstNameErrorMsg") : errorMsg("firstNameErrorMsg")
    lastNameControl() == true ? noErrorMsg("lastNameErrorMsg") : errorMsg("lastNameErrorMsg")
    addressControl() == true ? noErrorMsg("addressErrorMsg") : errorMsg("addressErrorMsg")
    cityControl() == true ? noErrorMsg("cityErrorMsg") : errorMsg("cityErrorMsg")
    emailControl() == true ? noErrorMsg("emailErrorMsg") : errorMsg("emailErrorMsg")

    //Contrôle validité formulaire avant de l'envoyer dans le local storage
    if (firstNameControl() && lastNameControl() && addressControl() && cityControl() && emailControl()) {
        // Enregistrer le formulaire dans le local storage
        localStorage.setItem("contact", JSON.stringify(contact))
        sendToServer()
    }

    //***** REQUÊTE DU SERVEUR ET POST DES DONNÉES *****//
    // Envoyer la requête POST au back-end
    function sendToServer () {
        //Tableau des produits selon le modèle du back-end
        let products = []
        //Boucle pour récupérer les id dans le local storage
        for(let k = 0; k < addToLocalStorage.length; k++){
            const productId = addToLocalStorage[k]._id
            products.push(productId)
        }

        const postServer = fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify({contact, products}),
            headers: {
                "Content-Type": "application/json",
            },
        })
    
        .then(async(response) => {
            try{
                //Récupérer l'Id de la réponse du serveur
                const dataServer = await response.json()
                const orderId = dataServer.orderId
                //Aller vers la page confirmation
                document.location.href = `confirmation.html?id=${orderId}`
            }catch(e){
                console.log(e)
            }
        })
    }
})










