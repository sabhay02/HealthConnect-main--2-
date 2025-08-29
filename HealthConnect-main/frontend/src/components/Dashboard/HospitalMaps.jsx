import { AlertTriangle, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";

const HospitalMaps = () => {
	const [userLocation, setUserLocation] = useState(null);
	const [nearbyHospitals, setNearbyHospitals] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Sample hospital data with sexual health specialists
	const hospitalData = [
		{
			id: 1,
			name: "City General Hospital",
			address: "123 Main St, Downtown",
			phone: "+1-555-0123",
			specialties: ["Sexual Health", "Reproductive Medicine", "STI Testing"],
			rating: 4.5,
			coordinates: { lat: 40.7128, lng: -74.0060 },
			hours: "24/7",
			website: "https://citygeneral.com"
		},
		{
			id: 2,
			name: "Women's Health Center",
			address: "456 Oak Ave, Midtown",
			phone: "+1-555-0456",
			specialties: ["Gynecology", "Sexual Health", "Family Planning"],
			rating: 4.7,
			coordinates: { lat: 40.7589, lng: -73.9851 },
			hours: "Mon-Fri 8AM-6PM",
			website: "https://womenshealthcenter.com"
		},
		{
			id: 3,
			name: "Metro Sexual Health Clinic",
			address: "789 Pine St, Uptown",
			phone: "+1-555-0789",
			specialties: ["STI Testing", "Sexual Health Counseling", "LGBTQ+ Care"],
			rating: 4.6,
			coordinates: { lat: 40.7831, lng: -73.9712 },
			hours: "Mon-Sat 9AM-7PM",
			website: "https://metrosexualhealth.com"
		},
		{
			id: 4,
			name: "University Medical Center",
			address: "321 College Blvd, University District",
			phone: "+1-555-0321",
			specialties: ["Sexual Health", "Student Health", "Reproductive Health"],
			rating: 4.3,
			coordinates: { lat: 40.8176, lng: -73.9782 },
			hours: "Mon-Fri 7AM-9PM",
			website: "https://universitymedical.com"
		},
		{
			id: 5,
			name: "Planned Parenthood Downtown",
			address: "654 Broadway, Financial District",
			phone: "+1-555-0654",
			specialties: ["Reproductive Health", "STI Testing", "Birth Control"],
			rating: 4.4,
			coordinates: { lat: 40.7074, lng: -74.0113 },
			hours: "Tue-Sat 8AM-5PM",
			website: "https://plannedparenthood.org"
		}
	];

	useEffect(() => {
		getCurrentLocation();
	}, []);

	const getCurrentLocation = () => {
		setLoading(true);
		setError(null);

		if (!navigator.geolocation) {
			setError("Geolocation is not supported by this browser");
			setLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				setUserLocation(location);
				findNearbyHospitals(location);
				setLoading(false);
			},
			(error) => {
				console.error("Geolocation error:", error);
				setError("Unable to get your location. Showing default area results.");
				// Use default location for demo
				const defaultLocation = { lat: 40.7128, lng: -74.0060 };
				setUserLocation(defaultLocation);
				findNearbyHospitals(defaultLocation);
				setLoading(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000
			}
		);
	};

	const findNearbyHospitals = (location) => {
		// Calculate distances and sort by proximity
		const hospitalsWithDistance = hospitalData.map(hospital => {
			const distance = calculateDistance(
				location.lat, 
				location.lng, 
				hospital.coordinates.lat, 
				hospital.coordinates.lng
			);
			return {
				...hospital,
				calculatedDistance: distance,
				distance: `${distance.toFixed(1)} km`
			};
		});

		// Sort by distance
		const sortedHospitals = hospitalsWithDistance
			.sort((a, b) => a.calculatedDistance - b.calculatedDistance);

		setNearbyHospitals(sortedHospitals);
	};

	// Haversine formula to calculate distance between two coordinates
	const calculateDistance = (lat1, lng1, lat2, lng2) => {
		const R = 6371; // Earth's radius in kilometers
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLng = (lng2 - lng1) * Math.PI / 180;
		const a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
			Math.sin(dLng/2) * Math.sin(dLng/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	};

	const openInMaps = (hospital) => {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}&destination_place_id=${hospital.name}`;
		window.open(url, '_blank');
	};

	const callHospital = (phone) => {
		window.location.href = `tel:${phone}`;
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Find Nearby Sexual Health Specialists</h1>
				<p className="mt-2 text-gray-600">Locate hospitals and clinics with sexual health professionals near you</p>
			</div>

			{loading && (
				<div className="text-center py-12">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Getting your location...</p>
				</div>
			)}

			{error && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
					<div className="flex items-center">
						<AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
						<p className="text-yellow-800">{error}</p>
					</div>
				</div>
			)}

			{userLocation && (
				<div className="mb-6">
					<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
						<div className="flex items-center">
							<MapPin className="h-5 w-5 text-blue-600 mr-2" />
							<div>
								<p className="text-blue-800 font-medium">Your Current Location</p>
								<p className="text-sm text-blue-600">
									Latitude: {userLocation.lat.toFixed(4)}, Longitude: {userLocation.lng.toFixed(4)}
								</p>
							</div>
							<button
								onClick={getCurrentLocation}
								className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
							>
								Refresh Location
							</button>
						</div>
					</div>
				</div>
			)}

			{nearbyHospitals.length > 0 && (
				<div className="space-y-6">
					<h2 className="text-xl font-semibold text-gray-900">
						{nearbyHospitals.length} Sexual Health Facilities Found
					</h2>
					
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{nearbyHospitals.map((hospital) => (
							<div key={hospital.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
								<div className="flex justify-between items-start mb-4">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
										<p className="text-gray-600 text-sm mt-1">{hospital.address}</p>
										<div className="flex items-center mt-2 space-x-4">
											<div className="flex items-center">
												<Star className="h-4 w-4 text-yellow-500 mr-1" />
												<span className="text-sm text-gray-600">{hospital.rating}</span>
											</div>
											<span className="text-sm text-blue-600 font-medium">📍 {hospital.distance}</span>
										</div>
									</div>
								</div>

								<div className="mb-4">
									<p className="text-sm font-medium text-gray-700 mb-2">Available Services:</p>
									<div className="flex flex-wrap gap-2">
										{hospital.specialties.map((specialty, index) => (
											<span
												key={index}
												className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
											>
												{specialty}
											</span>
										))}
									</div>
								</div>

								<div className="mb-4 text-sm text-gray-600">
									<p><strong>Hours:</strong> {hospital.hours}</p>
								</div>

								<div className="flex space-x-3">
									<button
										onClick={() => openInMaps(hospital)}
										className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex-1"
									>
										<MapPin className="h-4 w-4 mr-2" />
										Get Directions
									</button>
									<button
										onClick={() => callHospital(hospital.phone)}
										className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
									>
										<Phone className="h-4 w-4 mr-2" />
										Call
									</button>
								</div>

								{hospital.website && (
									<div className="mt-3">
										<a
											href={hospital.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-600 hover:text-blue-800 underline"
										>
											Visit Website →
										</a>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{!loading && nearbyHospitals.length === 0 && userLocation && (
				<div className="text-center py-12 text-gray-500">
					<MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
					<p className="text-lg">No sexual health facilities found in your area</p>
					<p className="text-sm mt-2">Try expanding your search radius or contact your local healthcare provider</p>
					<button
						onClick={getCurrentLocation}
						className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						Search Again
					</button>
				</div>
			)}
		</div>
	);
};

export default HospitalMaps;