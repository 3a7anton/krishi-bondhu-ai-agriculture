import { runMigrations, checkTableExists } from '../utils/runMigrations';

export default function TestMigrations() {
  const handleTestMigrations = async () => {
    console.log('Testing database connection and migrations...');
    
    try {
      const result = await runMigrations();
      console.log('Migration result:', result);
      
      // Test individual table existence
      const tables = ['products', 'orders', 'crops', 'inventory'] as const;
      for (const table of tables) {
        const exists = await checkTableExists(table);
        console.log(`Table ${table} exists:`, exists);
      }
      
    } catch (error) {
      console.error('Migration test failed:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Database Migration Test</h2>
      <button 
        onClick={handleTestMigrations}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Database Connection & Migrations
      </button>
      <div className="mt-4">
        <p>Check the browser console for results.</p>
        <p>If migrations are needed, apply the SQL files manually in Supabase Dashboard.</p>
      </div>
    </div>
  );
}
