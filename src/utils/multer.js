
const multer = require('multer');

const MiMETYPES = [ 'image/jpg','image/jpeg','image/png','image/webp','image/avif','image/gif'];

function productsUploader(){
  
    const multerConfig = multer({
        storage:multer.diskStorage({
            destination: function (req, file, cb){
                cb(null, 'src/public/folders/products/images');   
            },
            filename: function (req, file, cb){
                cb(null, Date.now()+ '-' +file.originalname);
            },   
        }),
        fileFilter:(req,file,cb)=>{
            if (MiMETYPES.includes(file.mimetype)) cb(null, true);   
            else cb(new Error(`Only ${MiMETYPES.join(' ')} mimetypes are allowed`));
        },
        limit:{
            fieldSize: 10000000
        }
    });

    const result = multerConfig.single('myfile')
    return result
}

function usersUploader(){
  
    const multerConfig = multer.diskStorage({

        destination: function (req, files, cb){
          
            let folder= ''
            if (files.fieldname === 'imageProfile') {
                folder = 'profiles' 
            } else {
                folder= 'documents' 
            }
            cb(null,`src/public/folders/users/${folder}`);
        },
        filename: function (req, file, cb){
            cb(null, Date.now()+ '_' +file.originalname);
        },
        
        
    });
    
    const result= multer({storage:multerConfig}).fields(
        [
        {
        name: 'imageProfile', maxCount: 1
        }, 
        {
            name: 'identification', maxCount: 1
        },
        {
            name: 'address', maxCount: 1
        },
        {
            name: 'accountStatus', maxCount: 1
        }
    ])

    
    return result

}

module.exports = {
    usersUploader,
    productsUploader
};

