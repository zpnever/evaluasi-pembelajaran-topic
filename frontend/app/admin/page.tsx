"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Loader2, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

// Definitions for data structure, assuming they are defined similarly as in Home.tsx
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

// Tipe untuk pengurutan
type SortKey = "nama" | "nim" | "created_at" | "title";
type SortDirection = "asc" | "desc";

const AdminPage = () => {
	const [topics, setTopics] = useState<topic[]>([]);
	const [loading, setLoading] = useState(true);
	const [toast, setToast] = useState<{ message: string; type: string } | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState("");

	// State untuk pengurutan
	const [sortConfig, setSortConfig] = useState<{
		key: SortKey;
		direction: SortDirection;
	}>({
		key: "created_at",
		direction: "desc",
	});

	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

	const showToast = (message: string, type = "error") => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	};

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

	// 1. Fetch Data
	useEffect(() => {
		const fetchTopics = async () => {
			try {
				setLoading(true);
				const response = await fetch(`${API_URL}/topic`);
				const json: response = await response.json();

				if (response.ok) {
					setTopics(json.data || []);
				} else {
					showToast("Gagal memuat data topik admin", "error");
				}
			} catch (err) {
				console.error(err);
				showToast("Terjadi kesalahan koneksi saat memuat data", "error");
			} finally {
				setLoading(false);
			}
		};

		fetchTopics();
	}, [API_URL]);

	// 2. Fungsi Pengurutan
	const sortTopics = (key: SortKey) => {
		let direction: SortDirection = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	// 3. Data yang Sudah Difilter dan Diurutkan (Menggunakan useMemo untuk performa)
	const sortedAndFilteredTopics = useMemo(() => {
		let data = [...topics];

		// Filter data berdasarkan searchQuery
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			data = data.filter(
				(t) =>
					t.title.toLowerCase().includes(query) ||
					t.mahasiswa.nama.toLowerCase().includes(query) ||
					t.mahasiswa.nim.includes(query)
			);
		}

		// Sort data
		data.sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;

			switch (sortConfig.key) {
				case "nama":
					aValue = a.mahasiswa.nama.toLowerCase();
					bValue = b.mahasiswa.nama.toLowerCase();
					break;
				case "nim":
					aValue = a.mahasiswa.nim;
					bValue = b.mahasiswa.nim;
					break;
				case "title":
					aValue = a.title.toLowerCase();
					bValue = b.title.toLowerCase();
					break;
				case "created_at":
					// Mengubah format tanggal "DD-MM-YYYY : HH-MM" menjadi format yang bisa dibandingkan (YYYYMMDDHHMM)
					const formatToComparable = (dateStr: string) => {
						const [datePart, timePart] = dateStr.split(" : ");
						const [d, m, y] = datePart.split("-");
						const [h, min] = timePart.split("-");
						return `${y}${m}${d}${h}${min}`;
					};
					aValue = formatToComparable(a.created_at);
					bValue = formatToComparable(b.created_at);
					break;
				default:
					return 0;
			}

			if (aValue < bValue) {
				return sortConfig.direction === "asc" ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortConfig.direction === "asc" ? 1 : -1;
			}
			return 0;
		});

		return data;
	}, [topics, sortConfig, searchQuery]);

	// Komponen Ikon Sort
	const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
		if (sortConfig.key !== columnKey) {
			return null;
		}
		return sortConfig.direction === "asc" ? (
			<ArrowUp className="w-3 h-3 ml-1" />
		) : (
			<ArrowDown className="w-3 h-3 ml-1" />
		);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
			{/* Toast Notification */}
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

			<div className="max-w-6xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					{/* Header */}
					<div className="bg-linear-to-r from-slate-800 to-slate-700 px-6 md:px-8 py-6">
						<h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
							Panel Admin - Data Topik
						</h1>
						<p className="text-slate-300 text-sm md:text-base">
							Tinjauan semua topik yang telah disubmit oleh mahasiswa.
						</p>
					</div>

					<div className="p-6 md:p-8">
						{/* Search Bar */}
						<div className="relative mb-6 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
							<input
								type="text"
								placeholder="Cari berdasarkan Judul, Nama, atau NIM..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
							/>
						</div>

						{/* Topics Table */}
						<div className="border border-slate-200 rounded-xl overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full">
									<thead className="bg-slate-50">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
												No.
											</th>
											{/* Kolom Nama Mahasiswa (Dapat diurutkan) */}
											<th
												className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
												onClick={() => sortTopics("nama")}
											>
												<div className="flex items-center">
													Nama
													<SortIcon columnKey="nama" />
												</div>
											</th>
											{/* Kolom NIM (Dapat diurutkan) */}
											<th
												className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
												onClick={() => sortTopics("nim")}
											>
												<div className="flex items-center">
													NIM
													<SortIcon columnKey="nim" />
												</div>
											</th>
											{/* Kolom Judul (Dapat diurutkan) */}
											<th
												className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
												onClick={() => sortTopics("title")}
											>
												<div className="flex items-center">
													Judul
													<SortIcon columnKey="title" />
												</div>
											</th>
											{/* Kolom Dibuat (Dapat diurutkan) */}
											<th
												className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
												onClick={() => sortTopics("created_at")}
											>
												<div className="flex items-center">
													Waktu Submit
													<SortIcon columnKey="created_at" />
												</div>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-200">
										{loading ? (
											<tr>
												<td
													colSpan={5}
													className="px-4 py-8 text-center text-slate-500"
												>
													<Loader2 className="w-6 h-6 animate-spin mx-auto" />
													Memuat data topik...
												</td>
											</tr>
										) : sortedAndFilteredTopics.length > 0 ? (
											sortedAndFilteredTopics.map((topic, index) => {
												const { date, time } = formatDateTime(topic.created_at);
												return (
													<tr
														key={topic.mahasiswa.nim}
														className="hover:bg-slate-50"
													>
														<td className="px-4 py-3 text-sm text-slate-600">
															{index + 1}
														</td>
														<td className="px-4 py-3 text-sm text-slate-800">
															{topic.mahasiswa.nama}
														</td>
														<td className="px-4 py-3 text-sm text-slate-600">
															{topic.mahasiswa.nim}
														</td>
														<td className="px-4 py-3 text-sm text-slate-600 max-w-lg">
															{topic.title}
														</td>
														<td className="px-4 py-3 text-sm text-slate-600">
															<div className="flex flex-col whitespace-nowrap">
																<span>{date}</span>
																<span>{time}</span>
															</div>
														</td>
													</tr>
												);
											})
										) : (
											<tr>
												<td
													colSpan={5}
													className="px-4 py-8 text-center text-slate-500"
												>
													Tidak ada topik yang ditemukan.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
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
};

export default AdminPage;
