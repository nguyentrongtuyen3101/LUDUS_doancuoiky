import prisma from "../../../prisma/client.js"; 
import { ServerException } from "../../../utils/errors.js";

export class subCategoryService {
    async create(data,id) {
          if(!(await prisma.category.findUnique({where:{id}}))) throw new ServerException("Danh mục không tồn tại", 404);
          if (await prisma.subcategory.findFirst({ where: { name: { contains: data.name, mode: "insensitive" },isActive:true } })) throw new ServerException("Danh mục con đã tồn tại", 409);
          const newSubCategory = await prisma.subcategory.create({
            data: {
              name: data.name,
              description: data.description,
              categoryId:id
            }
          });
          return newSubCategory;
    }
    async update(id, data) {
      const subCategory = await prisma.subcategory.findUnique({ where: { id } });
      if (!subCategory) throw new ServerException("Danh mục con không tồn tại", 404);
      if(data.name && data.name !== subCategory.name) {
        const existingSubCategory = await prisma.subcategory.count({ 
          where: { name: { contains: data.name, mode: "insensitive" },isActive:true } 
        });
        if (existingSubCategory>1) throw new ServerException("Danh mục con đã tồn tại", 409);
      }
      const updatedSubCategory = await prisma.subcategory.update({
        where: { id },
        data: {
          name: data.name || subCategory.name,
          description: data.description || subCategory.description,
        }
      });
      return updatedSubCategory;
      }
    async delete(id) {
      const subCategory = await prisma.subcategory.findUnique({ where: { id } });
      if (!subCategory) throw new ServerException("Danh mục con không tồn tại", 404);
      if(await prisma.product.count({where:{subcategoryId:id,isActive:true}})>0) throw new ServerException("Danh mục con đang được sử dụng, không thể xóa", 400);
      await prisma.subcategory.update({ where: { id }, data: { isActive: false } });
      return { message: "Xóa danh mục con thành công" };
    }
    async getAllCategory() {
      return await prisma.category.findMany();
      }
    async getAll(query) {
      const where=query.q? 
      {
        OR:[
          {name: { contains: query.q, mode: "insensitive" }},
          {description: { contains: query.q, mode: "insensitive" }}
        ]
        }:{};
      if(query.id){
        if(!await prisma.category.findUnique({where:{id:query.id}})) throw new ServerException("Danh mục không tồn tại", 404);
        where.categoryId=query.id;
      }
      const subCategories = await prisma.subcategory.findMany({
        where,
        skip: query.offset,
        take: query.limit,
      });
      const total= await prisma.subcategory.count(
        {where}
      );
      const totalPages = Math.ceil(total/ query.limit);
      return {
        data: subCategories,
        pagination: {
          total,
          totalPages,
          limit: query.limit,
          offset: query.offset,
        },
      };
    }
}