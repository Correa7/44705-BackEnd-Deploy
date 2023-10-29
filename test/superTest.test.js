const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Coderhouse Commission 44705 project Test', ()=>{ 

    before(function () {
        this.userId='6522b3ac44d1be1784c4bd7d'
        this.mockUser = {
            firstName: "User Test",
            lastName: "Coder",
            age: 25,
            email:'test@test.com.ar',
            password: "123456"
        };
        this.pid;
        this.mockProduct = {
            title: "Product Test",
            description: "Product test Description",
            price: 160.220,
            thumbnail: "Product test Image",
            code: "EGP",
            stock: 20,
            category: "GPEDAL",
            status:true
          };
        this.cid;
    })



    describe('Test Session api: /session/ ', ()=>{
       
        it('Test Login : Debe loguear correctamente al usuario', async function () {
        
          let user ={
              email:'correadamian2019@gmail.com',
              password: '123456'
          }
         
          const {statusCode,ok,info} = await requester.post('/session/login').send(user) 
       
         expect(statusCode).is.equal(200)
         expect(ok).to.be.ok.and.equal(true)
         expect(info).to.be.equal(false)
      })
      it('Cambiar rol del usuario: Debe cambiar el rol del usuario a Premium o a User', async function () {

           const {statusCode,_body} = await requester.put(`/api/user/premium/${this.userId}`)

           expect(statusCode).is.equal(201)
           expect(_body).to.have.property('status')
           expect(_body.status).to.be.ok.and.equal('success')
       })
      
      it('Eliminar Session', async function (){
          
          const {statusCode} = await requester.get('/session/logout')
          expect(statusCode).is.equal(200)
      
       })

   })
    
    describe('Test Product Api: api/product ',()=>{

        it('Traer todos los productos: El API Get /api/product debe devolver todos los productos guardados en la base de datos ', async function ( ){

            let {statusCode,_body} = await requester.get('/api/product').query({ limit:2,sort:'asc' }) 
           
            expect(statusCode).to.be.equal(200)
            expect(_body).to.have.property('payload');
            expect(_body.payload.products[0]).is.ok.and.to.have.property('id');
        })

        it("Crear un Producto: El API POST /api/product debe crear un nuevo producto correctamente", async function () {

            const { statusCode, _body } = await requester.post('/api/product').send(this.mockProduct)
                        
            expect(statusCode).to.be.equal(201)
            expect(_body.payload).is.ok.and.to.have.property('_id')
            expect(_body.payload).to.have.property('status').and.to.be.deep.equal(true)
            this.pid =_body.payload._id

        })
      
        it("Modificar un producto: El API PUT /api/product debe actualizar un producto localizado en la base de datos correctamente", async function () {

            const mockProductPut = {
                title: "Product Test PUT",
                description: "Product test Description: Put Product",
                price: 77777,
                thumbnail: "Product test Image - Put test",
                code: "EGP",
                stock: 10,
                category: "GPEDAL",
                status:false
              }
          
            const { statusCode, _body } = await requester.put(`/api/product/${this.pid}`).send(mockProductPut)
       
            expect(statusCode).to.be.equal(200)
            expect(_body.message).to.be.ok
            expect(_body.payload).to.have.property('title').and.to.be.deep.equal("Product Test PUT")

        })
       
         it("Eliminar un producto: El API DELETE /api/product debe eliminar un producto correctamente", async function () {

            const { statusCode, ok, _body } = await requester.delete(`/api/product/${this.pid}`)

            expect(statusCode).to.be.equal(400)
            expect(ok).to.be.eql(false)

        })

    })

    describe('Test Cart api: /api/cart' , ()=>{

        it('Test create cart: el metodo post /api/cart debe crear un carro en la base de datos', async function(){


            let {statusCode,_body} = await requester.post(`/api/cart`)
            
            expect(statusCode).to.be.equal(201)
            expect(_body).to.have.property('payload');
            expect(_body.message).is.ok.and.to.be.eql('Cart created successfuly');
            this.cid = _body.payload._id
        })

        it('Test get cart: el metodo get /api/cart/:cid debe devolver el carro almacenado en la base de datos', async function (){

           let {statusCode,_body} =await requester.get(`/api/cart/${this.cid}`)
           
            expect(statusCode).to.be.equal(200)
            expect(_body).to.have.property('payload');
            expect(_body.payload._id).is.ok.and.to.be.eql(`${this.cid}`);

        })

        
        it('Test delete cart: el metodo delete /api/cart/:cid debe eliminar todos los prodctos de un carro por id', async function (){
            
            let {statusCode,_body} = await requester.delete(`/api/cart/${this.cid}`)
          
            expect(statusCode).to.be.equal(200)
            expect(_body).to.have.property('message');
            expect(_body.status).is.ok.and.to.be.eql('success');
        })
      

    })
    
})