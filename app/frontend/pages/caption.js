import Head from "next/head";
import axios from "axios";

import {
	ChakraProvider,
	Heading,
	Flex,
	IconButton,
	HStack,
	VStack,
	StackDivider,
	TableContainer,
	Table,
	TableCaption,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Text,
} from "@chakra-ui/react";

import Nav from "../components/Nav";
import UploadAndDisplayImage from "../components/UploadAndDisplayImage";

import { useRef, useState } from "react";

const navItems = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Caption",
		href: "/caption",
	},
];

export default function Home() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [ans, setAns] = useState("");
	const [captions, setCaptions] = useState([]);

	const sendDataToParent = (image) => {
		setSelectedImage(image);
	};

	const toBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	async function sendFileToBackend(captionType) {
		console.log("TEST...");
		setCaptions("Loading...");

		var imgData = "";
		var bodyFormData = new FormData();

		try {
			imgData = await toBase64(selectedImage);
		} catch (error) {
			console.error(error);
		}
		console.log("Img data");
		console.log(imgData);

		bodyFormData.append("imageString", imgData);
		bodyFormData.append("captionType", captionType);

		const headers = {
			"Content-Type": "multipart/form-data",
			"Access-Control-Allow-Origin": "*",
		};

		axios
			.post("http://localhost:5000/api/caption", bodyFormData, {
				headers: headers,
			})
			.then((response) => {
				console.log(response);

				let temp = response.data.captions

				temp.forEach((item) => {
					return (
						<>
							<Flex height="5vh" justifyContent="center">
								{item}
							</Flex>

						</>
					)
				});

				setCaptions(temp);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<ChakraProvider>
			<div>
				<Head>
					<title>Listed - Image Captioning</title>
					<link rel="icon" href="/listedDarklogo.svg" />
				</Head>
				<Nav NAV_ITEMS={navItems} />
				<Flex height="25vh" alignItems="center" justifyContent="center">
					<Heading as="h1" size="2xl" noOfLines={2} textColor="blue.500">
						Image Captioning
					</Heading>
				</Flex>
				<HStack spacing={8}>
					<Flex height="50vh" width="100em" justifyContent="center">
						<UploadAndDisplayImage
							sendDataToParent={sendDataToParent}
							sendFileToBackend={sendFileToBackend}
						/>
					</Flex>
					<Flex height="50vh" width="100em" justifyContent="center">
						<Flex height="100vh" justifyContent="center">
							{captions}
						</Flex>
					</Flex>
				</HStack>
			</div>
		</ChakraProvider>
	);
}
