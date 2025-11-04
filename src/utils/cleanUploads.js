import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

export async function cleanUploads() {
  try {
    const files = await fs.readdir(uploadDir);
    if (files.length === 0) {
      console.log('✅ uploads folder is already empty.');
      return;
    }

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, file);
        try {
          await fs.unlink(filePath);
          console.log(`🧹 Deleted leftover file: ${file}`);
        } catch (err) {
          console.error(`⚠️ Failed to delete ${file}:`, err.message);
        }
      })
    );

    console.log('✅ uploads folder cleaned up on startup.');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('📂 uploads folder not found (will be created automatically).');
    } else {
      console.error('❌ Error cleaning uploads folder:', err);
    }
  }
}
