import { prisma } from "../../lib/prisma";
import { formatDate } from "../utils/formatDate";
export class TopicService {
    static async getAll() {
        try {
            const topics = await prisma.topic.findMany({
                include: {
                    mahasiswa: true,
                },
            });
            const result = topics.map((t) => {
                return {
                    title: t.title,
                    mahasiswa: {
                        nama: t.mahasiswa.nama,
                        nim: t.mahasiswa.nim,
                    },
                    created_at: formatDate(t.updatedAt),
                };
            });
            return result;
        }
        catch (error) {
            return error;
        }
    }
    static async getByNIM(nim) {
        try {
            const topic = await prisma.topic.findFirst({
                where: {
                    mahasiswa: {
                        nim: nim,
                    },
                },
            });
            return topic;
        }
        catch (error) {
            return error;
        }
    }
    static async create(request) {
        try {
            const mahasiswa = await prisma.mahasiswa.findFirst({
                where: {
                    nim: request.mahasiswa.nim,
                },
            });
            if (!mahasiswa) {
                throw new Error(`NIM ${request.mahasiswa.nim} tidak ditemukan`);
            }
            if (mahasiswa.nama !== request.mahasiswa.nama) {
                throw new Error(`Nama dengan NIM tidak sesuai`);
            }
            const result = await prisma.topic.upsert({
                where: {
                    mahasiswaId: mahasiswa.id,
                },
                update: {
                    title: request.title,
                    updatedAt: new Date(),
                },
                create: {
                    title: request.title,
                    mahasiswaId: mahasiswa.id,
                },
            });
            return result;
        }
        catch (error) {
            return error;
        }
    }
}
//# sourceMappingURL=topicService.js.map