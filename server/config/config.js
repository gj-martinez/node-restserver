//=================================
//      PUERTOS
//=================================

process.env.PORT = process.env.PORT || 3000; 


//=================================
//      ENTORNO
//=================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=================================
//      VENCIMIENTO TOKEN
//=================================
//60 SEGUNDOS
//60 MINUTOS
//24 HORAS
//30 DIAS

process.env.CADUCIDAD_TOKEN = '48h';

//=================================
//      SEED DE AUTENTICACION
//=================================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";


//=================================
//      Base de datos
//=================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//=================================
//      Google Client ID
//=================================

process.env.CLIENT_ID =  process.env.CLIENT_ID || '225854986058-gtoejvj3tbu8ibtmqm539mmha802vbnq.apps.googleusercontent.com';