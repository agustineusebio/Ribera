
const express = require('express');
const app = express();
const mysql = require('mysql2');
const hbs = require('hbs');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();

const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

const conexion = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,  
})

conexion.connect((err)=>{
    if(err) throw err;
      //console.log(`Conectado a la Database ${process.env.DATABASE}`);
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/productos', (req, res) => {
        res.render('productos', {
        titulo: 'Productos',
        })
})

app.get('/sucursal', (req, res) => {
        res.render('sucursal', {
        titulo: 'Sucursal',
        })
})

app.get('/clientes', (req, res) => {
    let sql = "SELECT * FROM clientes"; 
        conexion.query(sql, function(err, result){
        if (err) throw err;
        res.render('clientes', {
        titulo: 'Clientes',
        datos: result
        })
    })
})

app.get('/pedidos', (req, res) => {
    let sql = "SELECT * FROM pedidos"; 
        conexion.query(sql, function(err, result){
        if (err) throw err;
        res.render('pedidos', {
        titulo: 'Recibido',
        datos: result
        })
    }) 
})

app.post('/pedidos', (req, res) =>{
    const email = req.body.email;
    const idCliente = req.body.idCliente;
    const productos = req.body.productos;


async function envioMail(){
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
    }   
 });


let info = await transporter.sendMail({
from: process.env.EMAIL,
to: `${email}`,
subject: "LA RIBERA - Muchas gracias por comprar en nuestro Almacén",
html: `Hemos recibido su pedido con éxito.<br>
Le pedimos por favor que nos confirme su dirección y los horarios en que podemos pasar a realizar la entrega. <br>
Cualquier consulta puede contactarnos por este medio o por nuestras redes sociales. <br>
Esperamos su respuesta, que tenga un hermoso día!!!`
});


}

    let datos = {
        email: email,
        idCliente: idCliente,
        productos: productos,
    }

let sql = "INSERT INTO pedidos set ?";

conexion.query(sql, datos, function(err){
    if (err) throw err;
        //console.log(`1 pedido realizado`);

        //Email
        envioMail().catch(console.error);
        res.render('recibido')
    })
})


app.post('/clientes', (req, res)  => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const direccion = req.body.direccion;

   console.log(nombre)
    console.log(apellido);
    console.log(email);
    console.log(direccion);

    let datos = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        direccion: direccion
    }   
    
    let sql = "INSERT INTO clientes set ?";

        conexion.query(sql, datos, function(err){
            if (err) throw err;
             //console.log(`1 Registro insertado`);
                res.render('agregado')
        })

    
})

app.post('/delete', (req, res) => { 
    console.log(req.body.idCliente);
    let sql = "DELETE FROM clientes where idCliente = " + req.body.idCliente + "";
    console.log(sql);
    conexion.query(sql, function(err, result){
        if (err) throw err;
            console.log('Dato eliminado: ' + result.affectedRows);
            res.render('eliminado')
    })
})

app.post('/update', (req, res) => {

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const direccion = req.body.direccion;
    const idCliente = req.body.idCliente;

     let sql = "UPDATE clientes SET nombre = '" 
    + nombre 
    + "', apellido = '" 
    + apellido 
    + "', email = '" 
    + email 
    + "', direccion = '" 
    + direccion 
    + "' WHERE idCliente = " 
    + idCliente;

    console.log(sql);
    
    
    conexion.query(sql, function(err, result){
        if (err) throw err;
       // console.log('Dato modificado: ' + result.affectedRows);
        res.render('modificado')
    })
})


app.listen(PORT, () => {
  // console.log(`Servidor trabajando en el Puerto ${PORT}`);
})



