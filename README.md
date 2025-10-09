# xóa network cũ
docker network rm doancuoiky_default
# chạy docker (redis)
docker-compose up -d

# render shema.prisma
npm run db:generate
# push lên monggo alat
npm run db:push

# chạy server
npm run dev