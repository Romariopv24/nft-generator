// let db

export function ConexionDB() {
    return new Promise((resolve, reject)=>{
        const indexedDb = window.indexedDB;

        const conexion = indexedDb.open('ImagesDB',2)
    
        conexion.onsuccess = () =>{
            const db = conexion.result
            // console.log('Base de datos abierta', db)
            return resolve(db)
        }
    
        conexion.onupgradeneeded = (e) =>{
            const db = e.target.result
            console.log('Base de datos creada', db)
            const coleccionObjetos = db.createObjectStore('images',{
                keyPath: 'clave' 
            })
            const coleccionObjetos2 = db.createObjectStore('smallImages',{
                keyPath: 'clave' 
            })
            return resolve(db)
        }
    
        conexion.onerror = (error) =>{
            console.log('Error ', error)
            return reject(error)
        }
    })
}

export const agregar = (db, table, data) => {
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readwrite')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.add(data)
        conexion.onsuccess = async event => {
           return resolve(conexion.result)
        };
        // consultar()  
    })
}

export const obtener = (db, table, data) =>{
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readonly')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.get(data)

        conexion.onsuccess = (e) =>{
            // console.log(conexion.result)
            return resolve(conexion.result)
        } 
    })

    
}

export const actualizar = (db, table, data) =>{    
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readwrite')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.put(data)
        
        conexion.onsuccess = () =>{
            // consultar()
            return resolve(conexion.result)
        }
    })

}

export const eliminar = (db,table, clave) =>{      
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readwrite')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.delete(clave)

        conexion.onsuccess = async () =>{
            // consultar()
            return resolve()
        }  
    })
}

export const consultar = (db,table) =>{
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readonly')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.openCursor()
    
        console.log('Lista de tareas')
        const dbResults = []
        conexion.onsuccess = (e) =>{
            const cursor = e.target.result
            if(cursor){
                console.log(cursor.value)
                dbResults.push(cursor.value)
                cursor.continue()
            }else{
                console.log('No hay tareas en la lista')
                resolve(dbResults)
            }
        }
    })
}

export const reiniciar = (db,table) =>{    
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readwrite')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.clear()
        
        conexion.onsuccess = () =>{
            // consultar()
            return resolve(conexion.result)
        }
    })

}


export function obtenerTodo(db,table) {
    return new Promise((resolve, reject)=>{
        const trasaccion = db.transaction([table],'readonly')
        const coleccionObjetos = trasaccion.objectStore(table)
        const conexion = coleccionObjetos.getAll()

        conexion.onsuccess = (e) =>{
            // console.log(conexion.result)
            return resolve(conexion.result)
        } 
    })
}