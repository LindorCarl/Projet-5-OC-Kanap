//***** Récuperer l'id de la commande *****//
let getProductId = new URL(location.href).searchParams.get("id")

//***** Fonction pour effacer le local Storage après confirmation *****//
confirmOrder ()
function confirmOrder() {
    const orderConfirm = document.querySelector("#orderId")
    //Affichage de l'Id sur la page confirmation
    orderConfirm.innerHTML = `${getProductId}`
    //Ensuite vider le local storage
    localStorage.clear()
}
