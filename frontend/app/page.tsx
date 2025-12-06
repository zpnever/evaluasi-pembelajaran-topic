"use client";

import { useEffect, useState } from "react";
import {
	Search,
	ChevronDown,
	CheckCircle,
	AlertCircle,
	Loader2,
	ChevronLeft, // Ditambahkan untuk pagination
	ChevronRight, // Ditambahkan untuk pagination
} from "lucide-react";
import { mahasiswa } from "@/config/constant";

interface response {
	data: topic[];
}
interface topic {
	mahasiswa: {
		nama: string;
		nim: string;
	};
	title: string;
	created_at: string;
}

export default function Home() {
	const [step, setStep] = useState(1);
	const [topics, setTopics] = useState<topic[]>([]);
	const [selectedNama, setSelectedNama] = useState("");
	const [nim, setNim] = useState("");
	const [title, setTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [topicSearchQuery, setTopicSearchQuery] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [toast, setToast] = useState<{ message: string; type: string } | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	// State baru untuk pagination
	const [currentPage, setCurrentPage] = useState(1);
	const topicsPerPage = 5; // Batasan 5 baris per halaman

	const formatDateTime = (dateTimeStr: string) => {
		// Format: "06-12-2025 : 10-41"
		const [datePart, timePart] = dateTimeStr.split(" : ");
		const [day, month, year] = datePart.split("-");
		const [hour, minute] = timePart.split("-");

		return {
			date: `${day}/${month}/${year}`,
			time: `${hour}:${minute}`,
		};
	};

	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

	useEffect(() => {
		fetchTopics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	const fetchTopics = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_URL}/topic`);
			const json: response = await response.json();

			if (response.ok) {
				setTopics(json.data || []);

				// Check if current user already submitted
				const userTopic = json.data?.find((t) => t.mahasiswa.nim === nim);
				if (userTopic) {
					setTitle(userTopic.title);
				}
			}
		} catch (err) {
			console.log(err);
			showToast("Gagal memuat data topic", "error");
		} finally {
			setLoading(false);
		}
	};

	const showToast = (message: string, type = "error") => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	};

	const filteredMahasiswa = mahasiswa.filter(
		(m) =>
			m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
			m.nim.includes(searchQuery)
	);

	const filteredTopics = topics.filter(
		(t) =>
			t.title.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
			t.mahasiswa.nama.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
			t.mahasiswa.nim.includes(topicSearchQuery)
	);

	// Logika Pagination
	const indexOfLastTopic = currentPage * topicsPerPage;
	const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
	const currentTopics = filteredTopics.slice(
		indexOfFirstTopic,
		indexOfLastTopic
	);
	const totalPages = Math.ceil(filteredTopics.length / topicsPerPage);

	const paginate = (pageNumber: number) => {
		if (pageNumber > 0 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber);
		}
	};

	const handleNext = () => {
		if (!selectedNama || !nim) {
			showToast("Mohon lengkapi nama dan NIM");
			return;
		}

		const selectedMahasiswa = mahasiswa.find((m) => m.nama === selectedNama);
		if (!selectedMahasiswa || selectedMahasiswa.nim !== nim) {
			showToast("NIM dan Nama tidak sesuai");
			return;
		}

		setStep(2);
		// Reset halaman ke 1 saat masuk ke Step 2
		setCurrentPage(1);
	};

	const handleSubmit = async () => {
		if (!title.trim()) {
			showToast("Mohon isi judul topic");
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(`${API_URL}/topic`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					mahasiswa: {
						nim: nim,
						nama: selectedNama,
					},
					title: title,
				}),
			});

			const json = await response.json();

			if (response.ok) {
				setIsSuccess(true);
				fetchTopics();
			} else {
				showToast(json.message || "Gagal submit topic", "error");
			}
		} catch (error) {
			console.log(error);
			showToast("Terjadi kesalahan saat submit", "error");
		} finally {
			setLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-12 h-12 text-green-600" />
					</div>
					<h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
						Berhasil!
					</h2>
					<p className="text-slate-600 mb-6">
						Topic Anda telah berhasil disubmit
					</p>
					<button
						onClick={() => {
							setIsSuccess(false);
							setStep(1);
							setSelectedNama("");
							setNim("");
							setTitle("");
						}}
						className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
					>
						Kembali
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
			{toast && (
				<div className="fixed top-4 right-4 z-50 animate-slide-in">
					<div
						className={`${
							toast.type === "error" ? "bg-red-500" : "bg-green-500"
						} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2`}
					>
						<AlertCircle className="w-5 h-5" />
						<span>{toast.message}</span>
					</div>
				</div>
			)}

			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					{/* Header */}
					<div className="bg-linear-to-r from-slate-800 to-slate-700 px-6 md:px-8 py-6">
						<h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
							Submission Topic
						</h1>
						<p className="text-slate-300 text-sm md:text-base">
							{step === 1 ? "Masukkan identitas Anda" : "Masukkan judul topic"}
						</p>
					</div>

					{/* Progress Bar */}
					<div className="h-2 bg-slate-100">
						<div
							className="h-full bg-slate-800 transition-all duration-500"
							style={{ width: step === 1 ? "50%" : "100%" }}
						/>
					</div>

					<div className="p-6 md:p-8">
						{step === 1 ? (
							<div className="space-y-6">
								{/* Nama Select */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">
										Nama Mahasiswa
									</label>
									<div className="relative">
										<input
											type="text"
											placeholder="Cari nama..."
											value={searchQuery}
											onChange={(e) => {
												setSearchQuery(e.target.value);
												setShowDropdown(true);
											}}
											onFocus={() => setShowDropdown(true)}
											className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
										/>
										<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

										{showDropdown && (
											<div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
												{filteredMahasiswa.length > 0 ? (
													filteredMahasiswa.map((m, idx) => (
														<button
															key={idx}
															onClick={() => {
																setSelectedNama(m.nama);
																setSearchQuery(m.nama);
																setShowDropdown(false);
															}}
															className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
														>
															<div className="font-medium text-slate-800">
																{m.nama}
															</div>
														</button>
													))
												) : (
													<div className="px-4 py-3 text-slate-500 text-center">
														Tidak ditemukan
													</div>
												)}
											</div>
										)}
									</div>
									{selectedNama && (
										<p className="mt-2 text-sm text-green-600 flex items-center gap-1">
											<CheckCircle className="w-4 h-4" />
											{selectedNama}
										</p>
									)}
								</div>

								{/* NIM Input */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">
										NIM
									</label>
									<input
										type="text"
										placeholder="Masukkan NIM"
										value={nim}
										onChange={(e) => setNim(e.target.value)}
										className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
									/>
								</div>

								<button
									onClick={handleNext}
									className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors mt-6"
								>
									Lanjut
								</button>
							</div>
						) : (
							<div className="space-y-6">
								{/* Topics Table */}
								<div className="text-slate-700">
									<p className="font-semibold">Ketentuan: </p>
									<p>
										Literatur Review terkait Inovasi Evaluasi Pembelajaran
										berbasis Digital
									</p>
									<p>
										Contoh: (Setiap mahasiswa memiliki judul berbeda, hak
										berdasarkan first to comment)
									</p>
									<ul className="list-disc px-8">
										<li>
											Penggunaan AI feedback generator untuk mempercepat umpan
											balik tugas mahasiswa
										</li>
										<li>
											Sistem deteksi plagiarisme berbasis AI: Kelebihan,
											Kekurangan, dan Implikasinya
										</li>
										<li>
											Studi perbandingan efektivitas e-portofolio dan portofolio
											kertas
										</li>
									</ul>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-slate-800 mb-4">
										Topic yang sudah diambil
									</h3>

									{/* Search */}
									<div className="relative mb-4">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
										<input
											type="text"
											placeholder="Cari topic..."
											value={topicSearchQuery}
											onChange={(e) => {
												setTopicSearchQuery(e.target.value);
												setCurrentPage(1); // Reset ke halaman 1 saat pencarian
											}}
											className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
										/>
									</div>

									<div className="border border-slate-200 rounded-xl overflow-hidden">
										<div className="overflow-x-auto">
											<table className="w-full">
												<thead className="bg-slate-50">
													<tr>
														<th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
															Nama
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
															NIM
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
															Judul
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
															Dibuat
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-slate-200">
													{/* Menggunakan currentTopics untuk menampilkan data per halaman */}
													{currentTopics.length > 0 ? (
														currentTopics.map((topic, idx) => {
															const { date, time } = formatDateTime(
																topic.created_at
															);
															return (
																<tr key={idx} className="hover:bg-slate-50">
																	<td className="px-4 py-3 text-sm text-slate-800">
																		{topic.mahasiswa.nama}
																	</td>
																	<td className="px-4 py-3 text-sm text-slate-600">
																		{topic.mahasiswa.nim}
																	</td>
																	<td className="px-4 py-3 text-sm text-slate-600">
																		{topic.title}
																	</td>
																	<td className="px-4 py-3 text-sm text-slate-600">
																		<div className="flex flex-col">
																			<span>tanggal: {date}</span>
																			<span>waktu: {time}</span>
																		</div>
																	</td>
																</tr>
															);
														})
													) : (
														<tr>
															<td
																colSpan={4}
																className="px-4 py-8 text-center text-slate-500"
															>
																{loading ? (
																	<Loader2 className="w-6 h-6 animate-spin mx-auto" />
																) : (
																	"Belum ada topic tersedia"
																)}
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>

									{/* Pagination Controls */}
									{totalPages > 1 && (
										<div className="flex justify-between items-center mt-4">
											<button
												onClick={() => paginate(currentPage - 1)}
												disabled={currentPage === 1}
												className="flex items-center gap-1 px-3 py-1 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											>
												<ChevronLeft className="w-4 h-4" />
												Sebelumnya
											</button>

											<span className="text-sm text-slate-600">
												Halaman {currentPage} dari {totalPages}
											</span>

											<button
												onClick={() => paginate(currentPage + 1)}
												disabled={currentPage === totalPages}
												className="flex items-center gap-1 px-3 py-1 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											>
												Selanjutnya
												<ChevronRight className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>

								{/* Title Input */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">
										Judul Topic
									</label>
									<textarea
										placeholder="Masukkan judul topic Anda"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										rows={4}
										className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all resize-none text-slate-800"
									/>
								</div>

								<div className="flex gap-3">
									<button
										onClick={() => setStep(1)}
										className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-300 transition-colors"
									>
										Kembali
									</button>
									<button
										onClick={handleSubmit}
										disabled={loading}
										className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{loading && <Loader2 className="w-5 h-5 animate-spin" />}
										Submit
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes slide-in {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
				.animate-slide-in {
					animation: slide-in 0.3s ease-out;
				}
			`}</style>
		</div>
	);
}
