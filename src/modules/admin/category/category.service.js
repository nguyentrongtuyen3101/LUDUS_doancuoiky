import prisma from "../../../prisma/client.js"; 
import { ServerException } from "../../../utils/errors.js";

export class categoryService {
    async create(data) {
        const existingCategory = await prisma.category.findFirst({ 
            where: { name: { contains: data.name, mode: "insensitive" } } 
          });
          if (existingCategory) throw new ServerException("Danh mục đã tồn tại", 409);
          const newCategory = await prisma.category.create({
            data: {
              name: data.name,
              description: data.description,
            }
          });
          return newCategory;
    }
    async update(id, data) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) throw new ServerException("Danh mục không tồn tại", 404);
        if (data.name && data.name !== category.name) {
          const existingCategory = await prisma.category.count({ 
            where: { name: { contains: data.name, mode: "insensitive" } } 
          });
          if (existingCategory>1) throw new ServerException("Danh mục đã tồn tại", 409);
        }
        const updatedCategory = await prisma.category.update({
          where: { id },
          data: {
            name: data.name || category.name,
            description: data.description || category.description,
          }
        });
        return updatedCategory;
        }
    async delete(id) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) throw new ServerException("Danh mục không tồn tại", 404);
        await prisma.category.delete({ where: { id } });
        return { message: "Xóa danh mục thành công" };
    }
    async getAll() {
        const categories = await prisma.category.findMany();
        return categories;
    }
}
