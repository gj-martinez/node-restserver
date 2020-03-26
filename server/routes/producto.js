const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');
//=================================
//  MOSTRAR TODOS LOS PRODUCTOS
//=================================
app.get('/producto' ,verificaToken,(req, res) => {
    let desde =  req.query.desde || 0;
    desde = Number(desde);
 
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
            .skip(desde)
            .limit(limite)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err,productos) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(!productos){
                    return res.status(400).json({
                        ok: false,
                        err:{
                            message: 'El producto no esta disponible'
                        }
                    });
                }


                res.json({
                    ok: true,
                    productos
                });
            });
    
})

//=====================================
//  MOSTRAR TODOS LOS PRODUCTOS POR ID
//=====================================
app.get('/producto/:id',verificaToken,(req,res) => {

    let id = req.params.id

    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err,productoBD) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        
        if(!productoBD){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El producto no esta disponible'
                }
            });
        }

        res.json({
            ok:true,
            productoBD
        });
    });
})

//=================================
//  BUSCAR  UN PRODUCTO
//=================================

app.get('/producto/buscar/:termino',verificaToken,(req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');

    Producto.find({nombre: regex})
            .populate('categoria','descripcion')
            .exec((err,productos) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    productos
                });
            })

})

//=================================
//  CREAR UN NUEVO PRODUCTO
//=================================
app.post('/producto',verificaToken,(req, res) => {

    let body = req.body;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario,
    })

    producto.save((err,productoBD) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        res.json({
            ok:true,
            productoBD
        });

    });
})

//=================================
//  ACTUALIZAR UN PRODUCTO
//=================================
app.put('/producto/:id', verificaToken,(req, res) => {
    let id = req.params.id;
    let body = req.body;

    let productoUp = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id,productoUp,{new: true, runValidators: true},(err,productoUPBD) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if(!productoUPBD){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Id no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            productoUPBD
        });
    });
});

//=================================
//  ELIMINAR UN PRODUCTO
//=================================

app.delete('/producto/:id', verificaToken, (req,res) =>{

    let id = req.params.id;

    let prodcutoDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id,prodcutoDisponible,{new: true, runValidators: true},
        (err,productoDelete) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDelete){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'Id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message:'Producto eliminado',
            productoDelete
        });
    })

})

module.exports = app;