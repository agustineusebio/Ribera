create database Laribera;

use Laribera;

create table clientes(
idCliente int unsigned not null auto_increment,
nombre varchar(80) not null,
apellido varchar(80) not null,
email varchar(100) not null,
primary key(idCliente) 
);

create table pedidos(
idPedido int unsigned not null auto_increment,
email varchar(100) not null,
productos text,
idCliente int unsigned not null,
primary key(idPedido),
foreign key(idCliente) references clientes(idCliente)
);