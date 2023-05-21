class Producto {
    sku;            
    nombre;             
    precio;     
    categoria;
    stock;        

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;


        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}

const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);


const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


class Carrito {
    productos;   
    categorias;     
    precioTotal;    

    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        try {

            const producto = await findProductBySku(sku);
            console.log("Producto encontrado", producto);

            const index = this.productos.findIndex(p => p.sku === sku);
            if (index >= 0) {
                this.productos[index].cantidad += cantidad;
            } else {
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad, producto.precio);
                this.productos.push(nuevoProducto);

                if (!this.categorias.includes(producto.categoria)) {
                    this.categorias.push(producto.categoria);
                }
            }
            this.precioTotal += (producto.precio * cantidad);
        } catch (error) {
            console.log(error);
            console.log(`Error al agregar el producto ${sku}`);
        }
    }

    eliminarProducto(sku, cantidad){

        return new Promise((resolve, reject) => {

            console.log(`Eliminando ${cantidad} ${sku}`);
            const index = this.productos.findIndex((p) => p.sku === sku);

            if (index !== -1) {

                const productoEnCarrito = this.productos[index];

                if (productoEnCarrito.cantidad > cantidad) {

                    productoEnCarrito.cantidad -= cantidad;
                    this.precioTotal -= productoEnCarrito.precio * cantidad;
                    console.log(`Se eliminaron ${cantidad} unidades de ${productoEnCarrito.nombre} del carrito`);
                    resolve();
                } else {
                    
                    this.productos.splice(index, 1);
                    this.precioTotal -= productoEnCarrito.precio * productoEnCarrito.cantidad;

                    const categoria = productoEnCarrito.categoria;
                    const existeOtroProductoDeLaCategoria = this.productos.some((p) => p.categoria === categoria);

                    if (!existeOtroProductoDeLaCategoria) {
                        const indexCategoria = this.categorias.indexOf(categoria);
                        if (indexCategoria <= 0) {
                            this.categorias.splice(indexCategoria, 1);
                            console.log('Categorias en el carrito:', this.categorias);
                        }
                    }
                    console.log(`Se eliminaron todas las unidades de ${productoEnCarrito.nombre} del carrito`);
                    resolve();
                }
            } else {
                reject(`El producto ${sku} no existe en el carrito`);
            }
        });
    }
}


class ProductoEnCarrito {
    sku;    
    nombre;    
    cantidad;
    precio;  

    constructor(sku, nombre, cantidad, precio) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
    }

}

function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}


const carrito = new Carrito();
// agrego un producto al carrito
carrito.agregarProducto('KS944RUR', 2);
// agrego el mismo producto con la misma cantidad para que sume solo las cantidades
carrito.agregarProducto('KS944RUR', 2)
.then(() => {
    console.log(carrito.productos);
    console.log(carrito.categorias);
    console.log(carrito.precioTotal);
});
// agrego un producto de otra categoria para que se agregue esa categoria nueva a la lista
carrito.agregarProducto('WE328NJ', 1)
.then(() => {
    console.log(carrito.productos);
    console.log(carrito.categorias);
    console.log(carrito.precioTotal);
});
// agrego un producto que no existe
carrito.agregarProducto('ABC123', 1)
.then(() => {
    console.log(carrito.productos);
    console.log(carrito.categorias);
    console.log(carrito.precioTotal);
});

// pruebo agregar un producto y eliminar unidades del producto despues
const carrito2 = new Carrito();
carrito2.agregarProducto('UI999TY', 2)
.then(() => {
    console.log(carrito2.productos);
    console.log(carrito2.categorias);
    console.log(carrito2.precioTotal);
    carrito2.eliminarProducto('UI999TY', 1)
    .then(() => {
        console.log(carrito2.productos); 
        console.log(carrito2.categorias);
        console.log(carrito2.precioTotal);
    })
    .catch((error) => {
        console.log(error);
    });
});

// pruebo agregar un producto y eliminarlo por completo, y eliminar un producto que no existe
const carrito3 = new Carrito();
carrito3.agregarProducto('WE328NJ', 1)
.then(() => {
    console.log(carrito3.productos);
    console.log(carrito3.categorias);
    console.log(carrito3.precioTotal);
    carrito3.eliminarProducto('WE328NJ', 1)
    .then(() => {
        console.log(carrito3.productos); 
        console.log(carrito3.categorias);
        console.log(carrito3.precioTotal);
    })
    .catch((error) => {
        console.log(error);
    });
    carrito3.eliminarProducto('XX92LKI', 1)
    .then(() => {
        console.log(carrito3.productos);
    })
    .catch((error) => {
      console.log(error); 
  });
});
