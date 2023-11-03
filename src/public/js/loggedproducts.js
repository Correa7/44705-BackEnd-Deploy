function warningRol() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product Add to Cart',
        showConfirmButton: false,
        timer: 1000
      })
  }
  function warningError() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error to add Product to Cart',
        showConfirmButton: false,
        timer: 1000
      })
  }
const existingCart = document.querySelector(".userCart"); 

const API_URL = "http://44705-backend-deploy-production.up.railway.app/api/cart"   
  
async function addProductToCart(id){
    const url = API_URL + `/${existingCart?.id}/product/${id}`
    console.log(url)
    const data = {}
    if(existingCart){
    const options = {
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(data)
    }
    fetch(url, options)
    .then((response)=> response.json())
    .then(()=>{ 
        warningRol()
      
        setTimeout(() => {
            location.reload();
          }, 500) 
    })
    .catch((error)=>{
        console.error("Error:", error)
    })
}else{
    warningError()
    setTimeout(() => {
        location.reload();
      }, 500) 
    }


}

