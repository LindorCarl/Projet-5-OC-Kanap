// Récupération des données du local Storage
let addToLocalStorage = JSON.parse(localStorage.getItem("products"))

//***** Fonction pour récupérer les data de fetch et du local storage *****// 
async function fetchApi(){
    // Déclaration tableau vide pour pusher les objets créés dans la variable article
    let listArticle = []; 
    if (addToLocalStorage !== null) {
        for (let i = 0; i < addToLocalStorage.length; i++) {
        await fetch("http://localhost:3000/api/products/"+ addToLocalStorage[i]._id)
            .then((res) => res.json())
            .then((kanap) =>  {
                //Création d'un objet regroupant les infos nécessaires pour la suite
                const article = {
                    _id: addToLocalStorage[i]._id,
                    name: kanap.name,
                    price: kanap.price,
                    color: addToLocalStorage[i].color,
                    quantity: addToLocalStorage[i].quantity,
                    alt: kanap.altTxt,
                    img: kanap.imageUrl
                }
                //Ajout de l'objet article au tableau
                listArticle.push(article)
            })
            .catch(function (err) {
                console.log(err)
            })
        }
    }
    return listArticle
}


//***** Fonction pour afficher les produis sur la page panier *****// 
showProduct()
async function showProduct() {
	const responseFetch = await fetchApi()
    if(addToLocalStorage !== 0) {
        //***** Selection Element du DOM *****//
        const cartItems = document.querySelector("#cart__items")
        const totalQuantity = document.querySelector("#totalQuantity")
        responseFetch.forEach((product) => { 
            cartItems.innerHTML += `
         <article class="cart__item" data-id="${product._id}" data-color="${product.color}" data-quantity="${product.quantity}" data-price="${product.price}">
                    <div class="cart__item__img">
                        <img src="${product.img}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>${product.color}</p>
                            <p>${product.price}</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p> Qté :</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                            </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p> 
                            </div>
                        </div>
                    </div>
                </article>
            `
        })
        editQuantity()
        totalProduct()
    } 
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

                //Enlever la valeur 0 pour quantité 
                if (e.target.value <= 0) {
                    e.target.value = 1
                    cart.dataset.quantity = 1
                    localStorage.setItem("products", JSON.stringify(cartList))
                }
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
    cart.forEach((cart) => {
        // Récupération des quantités des articles grâce au dataset
        totalArticle += JSON.parse(cart.dataset.quantity)
        totalPrice += cart.dataset.quantity * cart.dataset.price
    })
    // Pointer l'endroit d'affichage du nombre d'article
    document.getElementById("totalQuantity").textContent = totalArticle
    // Pointer l'endroit d'affichage du prix total
    document.getElementById("totalPrice").textContent = totalPrice 
}

//***** Fonction de récupération du LocalStorage *****//
function getLocalStorage() {  
    return JSON.parse(localStorage.getItem("products"))
}

//***** Fonction pour supprimer les articles *****//
deleteArticle()
async function deleteArticle() {
    await fetchApi()
    //Selection Element du DOM 
    const deleteItem = document.querySelectorAll(".deleteItem")
    deleteItem.forEach((article) => {
        // Ecouter le clic de l'element
        article.addEventListener("click", (e) => {
            let localStorageValue = getLocalStorage()
            //Récupérer l'ID concerné
            const idSelectedProduct = e.target.closest("article").getAttribute("data-id")
            //Récupérer la couleur concernée
            const colorSelectedProduct = e.target.closest("article").getAttribute("data-color")
            //Chercher dans Local Storage l'élément concerné
            const searchDeleteKanap = localStorageValue.find((el) => el._id == idSelectedProduct && el.color == colorSelectedProduct)
            //Methode filter selectionne les éléments à garder et supprime l'élément ou le btn a été cliqué
            localStorageValue = localStorageValue.filter((item) => item != searchDeleteKanap)
            //Envoie nouvelles données vers le local storage
            localStorage.setItem("products", JSON.stringify(localStorageValue))
            // Supprimer l'élément du DOM
            const getSection = document.querySelector("#cart__items")
			getSection.removeChild(e.target.closest("article")) 
            //Mettre à jour quantité et prix dynamiquement
            editQuantity()
            totalProduct()
        })
    })
            
    //Affichage informatif
    if(getLocalStorage() === null){
        //H1 informatif
        const emptyCart = document.querySelector("h1")
        emptyCart.textContent = "Votre panier est vide"
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
    function sendToServer() {
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
