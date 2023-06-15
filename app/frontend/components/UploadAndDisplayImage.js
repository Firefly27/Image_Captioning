import React, { useState } from "react";

import {
	ChakraProvider,
	Flex,
	Heading,
	Button,
	VStack,
} from "@chakra-ui/react";

const UploadAndDisplayImage = ({ sendDataToParent, sendFileToBackend }) => {
	const [selectedImage, setSelectedImage] = useState(null);

	return (
		<ChakraProvider>
			<div>
				<Heading as="h1" size="lg" noOfLines={1} textColor="blue.400">
					Upload Image
				</Heading>
				{selectedImage && (
					<div>
						<img
							alt="not fount"
							width={"250px"}
							src={URL.createObjectURL(selectedImage)}
						/>
						<br />
						<Button
							colorScheme="blue"
							size="xs"
							onClick={() => setSelectedImage(null)}
						>
							Remove
						</Button>
					</div>
				)}
				<br />

				<br />
				<input
					type="file"
					name="myImage"
					onChange={(event) => {
						setSelectedImage(event.target.files[0]);
						sendDataToParent(event.target.files[0]);
					}}
				/>
			</div>
			<div>
				<Flex height="10vh">
					<Button onClick={()=>sendFileToBackend("single")}> Generate Caption</Button>
				</Flex>
				<Flex height="10vh">
					<Button onClick={()=>sendFileToBackend("multiple")}> Generate Multiple Captions</Button>
				</Flex>
			</div>
		</ChakraProvider>
	);
};

export default UploadAndDisplayImage;
