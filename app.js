// =================================================================
// 1. PATRÓN SINGLETON (Creacional)
// Garantiza que solo exista una instancia de conexión a la BD
// =================================================================
class Database {
  constructor() {
    // Si la instancia ya fue creada anteriormente, la devuelve de inmediato
    if (Database.instance) return Database.instance;

    // Configuración inicial del recurso (se ejecuta solo la primera vez)
    this.connection = "DB_Conectada_v1";

    // Guarda la instancia creada en una propiedad estática
    Database.instance = this;
  }
}

// =================================================================
// 2. PATRÓN REPOSITORY (Estructural / Persistencia)
// Abstrae el acceso a la base de datos para separar la lógica
// =================================================================
class UserRepository {
  constructor() {
    // Obtiene la conexión global mediante Singleton
    this.db = new Database().connection;
  }

  // Método que simula la persistencia o guardado del objeto en la BD
  save(user) {
    console.log(`[Repository] Guardando usuario "${user.name}" (${user.role}) en ${this.db}`);
  }
}

// =================================================================
// 3. PATRÓN FACTORY (Creacional)
// Encapsula la creación de objetos según parámetros sin usar 'new'
// =================================================================
class UserFactory {
  // Método estático de fábrica para instanciar tipos de usuario
  static createUser(type, name) {
    if (type === 'admin') return { name, role: 'ADMIN', permissions: ['all'] };
    return { name, role: 'GUEST', permissions: ['read'] };
  }
}

// =================================================================
// 4. PATRÓN MVC - CONTROLADOR (Arquitectura)
// Coordina la petición recibida, aplica la lógica y responde
// =================================================================
class UserController {
  constructor() {
    // Inyecta el repositorio para interactuar con la capa de datos
    this.userRepo = new UserRepository();
  }

  createAdmin(req) {
    // 1. Usa la Factory para fabricar la estructura de un usuario 'admin'
    const newUser = UserFactory.createUser('admin', req.body.name);

    // 2. Utiliza el Repository para guardar los datos
    this.userRepo.save(newUser);

    // 3. Devuelve una respuesta HTTP simulada al cliente
    return { status: 200, body: "Usuario Creado" };
  }
}

// =================================================================
// 5. JWT + INTERCEPTOR (Seguridad / Comunicaciones HTTP)
// Captura peticiones salientes e inyecta el token de sesión
// =================================================================
function httpInterceptor(request) {
  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Token de autenticación

  console.log("[Interceptor] Interceptando petición a:", request.url);

  // Inyecta el encabezado Authorization con el token JWT
  request.headers