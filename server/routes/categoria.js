const express = require('express');
const {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion');

const app = express();
let Categoria = require('../models/categoria');

//=================================
//  MOSTRAR TODAS LA CATEGORIAS
//=================================
app.get('/categoria',verificaToken,(req,res) => {
   Categoria.find({})
            .sort('descripcion')
            .populate('usuario','nombre email')
            .exec((err,categoria) =>{
                 if(err){
                     return res.status(400).json({
                         ok:false,
                         err
                     });
                 }


                res.json({  
                    ok:true,
                    categoria
                });

             });
});

//====================================
//  MOSTRAR UNA LA CATEGORIAS POR ID
//====================================
app.get('/categoria/:id',verificaToken,(req,res) => {

    let id = req.params.id;

    Categoria.findById(id, (err,categoria) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        };

        res.json({
            ok:true,
            categoria
        });
    });
});

//=================================
//  CREAR NUEVA CATEGORIA
//=================================
app.post('/categoria',verificaToken,(req,res) => {

    let body = req.body;
    let id = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    });

    categoria.save((err,categoriaDB) => {
        //error de base de datos 500
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        //me falto verificar si se creo la categoria
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'el id no existe'
                }
            });
        };

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });

});

//=================================
//  ACTUALIZAR CATEGORIA
//=================================
app.put('/categoria/:id',verificaToken,(req,res) =>{

    let id= req.params.id;
    let body = req.body;

    let descrpcionUpdate = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id,descrpcionUpdate,{new: true, runValidators:true},(err,categoriaUP) =>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        res.json({
            ok:true,
            categoriaUP
        });
    });
});

//=================================
//   ELIMINAR CATEGORIA
//=================================
app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role],(req,res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDelete)=> {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if(!categoriaDelete){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'el id no existe'
                }
            });
        };

        res.json({
            ok: true,
            message: 'Categoria borrada',
            categoriaDelete
        });
    });
});


module.exports = app;