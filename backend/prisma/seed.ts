import { prisma } from "../lib/prisma";

async function main() {
	console.log("Start seeding Mahasiswa data...");

	const mahasiswaData = [
		{ nama: "Sarah", nim: "1512619071" },
		{ nama: "Wibisono Luqmanulhakim", nim: "1512620093" },
		{ nama: "ANGGI PRARERA", nim: "1512623001" },
		{ nama: "VIRGIAWAN LISTIYANTO", nim: "1512623002" },
		{ nama: "NAYLAH HANIIFAH RAMADHANI", nim: "1512623003" },
		{ nama: "CHRISMANUEL MARSHELIANO PURBA", nim: "1512623004" },
		{ nama: "DEFA RAHMITA RIFQI RAMADHANI", nim: "1512623005" },
		{ nama: "MUHAMMAD FAUZAN", nim: "1512623006" },
		{ nama: "NICHOLAS HILARIUS DEVINO SIANIPAR", nim: "1512623007" },
		{ nama: "SYARIL PRATAMA", nim: "1512623008" },
		{ nama: "IBNU SABIL ADRIZA", nim: "1512623009" },
		{ nama: "BAYU NUURU HISYAM", nim: "1512623010" },
		{ nama: "AHMAD TAUFIK", nim: "1512623011" },
		{ nama: "SYLVI INDRIANI", nim: "1512623012" },
		{ nama: "MAULA IBRAHIM SYAHWI", nim: "1512623013" },
		{ nama: "DJUANDA HARIANTO", nim: "1512623014" },
		{ nama: "MUHAMMAD FARID", nim: "1512623016" },
		{ nama: "MUHAMAD HIDAYAH NURDJATI", nim: "1512623017" },
		{ nama: "MUHAMAD AKMAL HIDAYAT", nim: "1512623018" },
		{ nama: "MUAWIYAH USAMA BAHANAN", nim: "1512623019" },
		{ nama: "MUHAMMAD AKHYAR", nim: "1512623020" },
		{ nama: "MUHAMMAD ZIDAN", nim: "1512623021" },
		{ nama: "RAAJ PAHLEVI TAMBRIN", nim: "1512623022" },
		{ nama: "MUHAMMAD HISYAM FIKRI FADHILLAH", nim: "1512623024" },
		{ nama: "RASTIA SATRIA MIKHA", nim: "1512623025" },
		{ nama: "MUHAMMAD DESTA ABDILLAH", nim: "1512623027" },
		{ nama: "AHMAD RAFFY", nim: "1512623028" },
		{ nama: "ARZAID ALBANI", nim: "1512623029" },
		{ nama: "MOHAMMAD ASYIF RAZA", nim: "1512623030" },
		{ nama: "RURI FEBRIYANTI", nim: "1512623031" },
		{ nama: "RAFLI ALRIZKI", nim: "1512623032" },
		{ nama: "PETRA NATANAEL HUTASOIT", nim: "1512623034" },
		{ nama: "BAYU PERMANA", nim: "1512623035" },
		{ nama: "FAVIAN RIFQIZIWANI", nim: "1512623036" },
		{ nama: "DEWI RAHMA SARI", nim: "1512623037" },
		{ nama: "DANU SUKO HANDIYANTO", nim: "1512623038" },
		{ nama: "JOSAFAT BRAMASTA NOVRISA RENDRAGRAHA", nim: "1512623039" },
		{ nama: "NABILA ARISTI", nim: "1512623040" },
		{ nama: "MUHAMMAD IQBAL HUSAIN", nim: "1512623041" },
		{ nama: "AKBAR RAMADHAN PUTRA SETIAWAN", nim: "1512623042" },
		{ nama: "MUHAMMAD ARIQ JAUHAR", nim: "1512623043" },
		{ nama: "GANENDRA RIZKY DENIARTRA", nim: "1512623044" },
		{ nama: "MUHAMMAD ARIQ SYAHPUTRA", nim: "1512623045" },
		{ nama: "MUHAMMAD ALI AKBAR", nim: "1512623046" },
		{ nama: "SYAEFUL MUMININ", nim: "1512623047" },
		{ nama: "ALOYSIUS ANGELO RATU", nim: "1512623048" },
		{ nama: "FAKHRI FATUROHMAN", nim: "1512623049" },
		{ nama: "DENI MERDIANSYAH", nim: "1512623050" },
		{ nama: "NASTITI PUTRI WULANDARI", nim: "1512623051" },
		{ nama: "ALVIAN NURHAKIM", nim: "1512623052" },
		{ nama: "LUTHFI ADHI PRASETYA", nim: "1512623053" },
		{ nama: "HANNA RIFA", nim: "1512623054" },
		{ nama: "FAISAL AZHAR SALAM", nim: "1512623055" },
		{ nama: "NAUFAL IRFAN MUZAQI", nim: "1512623056" },
		{ nama: "FELIX EVAN SEMBADA", nim: "1512623057" },
		{ nama: "ZAHRA MAYANG IRAWAN", nim: "1512623058" },
		{ nama: "ALIF ZULFAN FADHILAH", nim: "1512623059" },
	];

	for (const m of mahasiswaData) {
		const mahasiswa = await prisma.mahasiswa.create({
			data: m,
		});
		console.log(
			`Created Mahasiswa with ID: ${mahasiswa.id} and NIM: ${mahasiswa.nim}`
		);
	}

	console.log("Seeding finished successfully.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
