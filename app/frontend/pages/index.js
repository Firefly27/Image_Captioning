import Head from "next/head";

import { ChakraProvider, Flex, Heading } from "@chakra-ui/react";

import { useRouter } from "next/router";

import Nav from "../components/Nav";

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
	const { asPath } = useRouter();

	return (
		<ChakraProvider>
			<div>
				<Head>
					<title>Listed - Image Captioning</title>
					<link rel="icon" href="/listedDarklogo.svg" />
				</Head>
				<Nav NAV_ITEMS={navItems} />
				<Flex height="20vh" alignItems="center" justifyContent="center"></Flex>
				<Flex height="30vh" alignItems="center" justifyContent="center">
					<img src="/listedDarklogo.svg" height="100px" width="200px"/>
				</Flex>
				<Flex height="60vh" justifyContent="center">
					<Heading as="h1" size="4xl" noOfLines={1} textColor="blue.500">
						Image Captioning
					</Heading>
				</Flex>
			</div>
		</ChakraProvider>
	);
}

