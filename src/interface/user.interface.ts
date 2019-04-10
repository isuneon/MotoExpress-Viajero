export interface User {
	nombre: string,
	apellido: string,
	documento_identidad: number,
	genero: string,
	fecha_nacimiento: string,
	correo: string,
	password: string,
	type_acount: string,
	status: string,
	autorizado: boolean,
	marca?: string,
	modelo?: string,
	ano?: string,
	color?: string,
	placa?: string
}