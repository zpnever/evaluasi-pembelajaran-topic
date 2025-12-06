import { title } from "node:process";
import { prisma } from "../../lib/prisma";
import type { RequestCreate } from "../models/topicModel";
import { formatDate } from "../utils/formatDate";

export class TopicService {
	public static async getAll() {
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
		} catch (error) {
			return error;
		}
	}

	public static async getByNIM(nim: string) {
		try {
			const topic = await prisma.topic.findFirst({
				where: {
					mahasiswa: {
						nim: nim,
					},
				},
			});

			return topic;
		} catch (error) {
			return error;
		}
	}

	public static async create(request: RequestCreate) {
		try {
			if (title === "" || !title) {
				throw new Error("Field topic title wajib diisi");
			}

			if (!request.mahasiswa.nama || !request.mahasiswa.nim) {
				throw new Error("Field mahasiswa wajib diisi");
			}

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
		} catch (error) {
			return error;
		}
	}
}
