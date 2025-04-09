// backend/testConnection.js
import supabase from './db.js';

async function testDB() {
	const { data, error } = await supabase
		.from('campaigns') // nombre exacto de tu tabla en Supabase
		.select('*')
		.limit(1);

	if (error) {
		console.error('❌ Error al conectar con la base de datos:', error.message);
	} else {
		console.log('✅ Conexión exitosa. Primer registro:', data);
	}
}

testDB();
