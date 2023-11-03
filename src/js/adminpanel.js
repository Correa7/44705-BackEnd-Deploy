function warningRol() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'User role change',
        showConfirmButton: false,
        timer: 1000
      })
  }
function warningDel() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'User Deleted',
        showConfirmButton: false,
        timer: 1000
      })
  }
  function warningDelInactive() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Successfully deleted users',
        showConfirmButton: false,
        timer: 1000
      })
  }

async function delUser(id){
    const url =`http://44705-backend-deploy-production.up.railway.app/api/admin/panel/${id}`
    
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
        console.log('User deleted')
        setTimeout(() => {
            location.reload();
          }, 500);
    })
    .catch((error)=>{
        console.error("Error:", error)
    })
}
 
async function rolUser(id){
    const url =`http://44705-backend-deploy-production.up.railway.app/api/admin/panel/${id}`
  
    const options = {
        method: "PUT",
        headers:{
            "Content-Type":"application/json",
        } 
    }
    fetch(url, options)
    .then((response)=> response.json())
    .then(()=>{
        warningRol()
        console.log('User change rol')
        setTimeout(() => {
            location.reload();
          }, 500);
    })
    .catch((error)=>{
        console.error("Error:", error)
    })
}

async function delInactiveUsers(){
    const url =`http://44705-backend-deploy-production.up.railway.app/api/admin/panel`
    
    const options = {
        method: "DELETE",
        headers:{
            "Content-Type":"application/json",
        }
    }
    fetch(url, options)
    .then((response)=> response.json())
    .then(()=>{
        
        warningDelInactive()
        console.log('User deleted')
        setTimeout(() => {
            location.reload();
          }, 500);
    })
    .catch((error)=>{
        console.error("Error:", error)
    })
}


