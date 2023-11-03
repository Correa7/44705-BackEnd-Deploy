function warningDel() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Product Deleted to cart',
        showConfirmButton: false,
        timer: 1000
      })
  }

  const cart = document.querySelector(".idCart");
  let idcart = cart.id 

  console.log(idcart) 
async function delProduct(id){
    console.log('product id : ' + id)
    const url =`http://44705-backend-deploy-production.up.railway.app/api/cart/${idcart}/product/${id}`
    
    const options = {
        method: "DELETE",
        headers:{
            "Content-Type":"application/json",
        }
    }
    fetch(url, options)
    .then((response)=> response.json())
    .then(()=>{
        warningDel()
        setTimeout(() => {
            location.reload();
          }, 1000);
    })
    .catch((error)=>{
        console.error("Error:", error)
    })
}
 
