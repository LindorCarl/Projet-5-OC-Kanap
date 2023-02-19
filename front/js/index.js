//***** Récupération des données de l'API *****//
const KanapData = fetch("http://localhost:3000/api/products")

KanapData.then ((response) => response.json())
. then((data) => {
    console.log(data);
        //Appel de la fonction d’affichage des produits
    kanapArticle(data);
})
.catch(err => console.log("Oh no", err))

//***** fonction d’affichage des produits de l’API sur la page index *****//
function kanapArticle (data) {
        //Selection des éléments du DOM
    const kanapItem = document.querySelector("#items")
    let kanapProduct = ""
        //Itétation sur la variable "response" pour recuperer les données 
    for (i = 0; i < data.length; i++) {
        kanapProduct += `
        <a href="./product.html?id=${data[i]._id}">
            <article>
                <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
                <h3 class="productName">${data[i].name}</h3>
                <p class="productDescription">${data[i].description}</p>
            </article>
        </a> 
        `
        //Injection dans HTML
        kanapItem.innerHTML = kanapProduct
    }
}

