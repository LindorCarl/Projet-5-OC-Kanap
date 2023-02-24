//***** Récuperer l'ID dans l'URL *****//
const queryStringUrl = window.location.search
const urlSearchParams = new URLSearchParams(queryStringUrl)
const id = urlSearchParams.get("id")

//***** Afficher les infos des produits par ID *****//
const KanapData = fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
        idSelectedProduct(data)
        cartProduct(data)
    })
    .catch(err => console.log ("Oh no", err))

//***** Fonction d’affichage de chaque produit de l’API sur la page produit *****//
function idSelectedProduct(data) {
        //Affichage Title
    const kanapTitle = document.querySelector("title")
    kanapTitle.innerHTML = `${data.name}`

        //Affichage Image
    const kanapItemImg = document.querySelector (".item__img")
    const kanapImg = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
    kanapItemImg.innerHTML = kanapImg

        //Affichage "Titre-Prix-Description"
    const kanapItemTitle = document.querySelector ("#title")
    kanapItemTitle.textContent = `${data.name}`
    const kanapItemPrice = document.querySelector("#price")
    kanapItemPrice.textContent = `${data.price}`
    const kanapItemdDescription = document.querySelector("#description")
    kanapItemdDescription.textContent = `${data.description}`

        //Affichage des couleurs
    const colorsChoice = data.colors
        //Itétation sur la variable "colorschoice" pour récupérer les données 
    for (let i = 0; i < colorsChoice.length; i++) {
        let kanapColors = []
        kanapColors = `<option value="${colorsChoice[i]}">${colorsChoice[i]}</option>`
        const kanapItemColors = document.querySelector("#colors")
        kanapItemColors.innerHTML += kanapColors
    }
}

//***** Gestion du panier *****//
const selectColors = document.querySelector("#colors")
const selectQuantity = document.querySelector("#quantity")
    //Selection bouton du DOM
const addToCart = document.querySelector("#addToCart")
    //Création d'une fonction pour le click du bouton
function cartProduct(data) {
    addToCart.addEventListener("click", (e) => {
        e.preventDefault()
        //Choix de la couleur et quantité dans une variable 
        const colorsValue = selectColors.value
        const quantityValue = selectQuantity.value
    
        //Récupération des valeurs choisies 
        let objectProduct = {
            altTxt : data.altTxt,
            color : colorsValue,
            description : data.description,
            imageUrl : data.imageUrl,
            name : data.name,
            quantity : quantityValue,
            _id : id,
            price : data.price,
        }
    
        let addToLocalStorage = JSON.parse(localStorage.getItem("products"))

        //***** Gestion du warning *****//
        function warningMessage() {
            if( quantityValue < 1 || quantityValue > 100 || quantityValue === undefined || colorsValue === "" || colorsValue === undefined) {
                warningError()
            } else if (addToLocalStorage){
                warningConfirm()
                //Rechercher avec la méthode find() si l'id et la couleur d'un article est déjà présent dans le local storage
                let item = addToLocalStorage.find(
                    (item) => item._id === objectProduct._id && item.color === objectProduct.color
                )
                //Si oui, ajout de la nouvelle quantité et la mise à jour du prix de l'article
                if(item){
                    item.quantity = parseInt(item.quantity) + parseInt(objectProduct.quantity)
                    //Dernière commande retourne un nouveau panier dans le localStorage
                    return localStorage.setItem("products", JSON.stringify(addToLocalStorage))
                }
                //Si l'article n'est pas déjà dans le local storage alors push du nouvel article sélectionné
                addToLocalStorage.push(objectProduct)
                localStorage.setItem("products", JSON.stringify(addToLocalStorage))
            } else {
                addToLocalStorage = []
                addToLocalStorage.push(objectProduct)
                localStorage.setItem("products", JSON.stringify(addToLocalStorage))
            }
        }
        warningMessage()
    })
}

//Effet visuel en cas d'oubli de la couleur ou quantité
function warningError() {
    const warning = document.createElement("p")
    warning.innerHTML = "Merci d'indiquer une couleur et une quantité comprise entre 1 et 100"
    warning.style.color = "yellow"
    document.querySelector(".item__content__settings__alert").appendChild(warning)
    setTimeout(function() {warning.remove()}, 2000)
}

//Effet visuel lorsqu'un produit est ajouté au panier
function warningConfirm() {
    const warning = document.createElement("p")
    warning.innerHTML = "Votre article a bien été ajouté au panier"
    warning.style.color = "RGB(0,255,0)"
    warning.style.fontWeight = "bold"
    document.querySelector(".item__content__settings__alert").appendChild(warning)
    setTimeout(function() {warning.remove()}, 2000)
}


