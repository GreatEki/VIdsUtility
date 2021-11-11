import React, { useState, useRef } from 'react';
import { BsCamera, BsCameraVideoFill, BsDownload } from 'react-icons/bs';
import { FaVideoSlash } from 'react-icons/fa';
import { RecordRTCPromisesHandler } from 'recordrtc';
import { Player } from 'video-react';
import { saveAs } from 'file-saver';

import './camera.scss';

const Camera = () => {
	const [actionType, setActionType] = useState('video');
	const [theRecorder, setTheRecorder] = useState(null);
	const [theStream, setTheStream] = useState(null);
	const [videoBlob, setVideoBlob] = useState(null);

	const videoRef = useRef();

	const initialiseCamera = async () => {
		try {
			let stream;

			if (actionType === 'video') {
				stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: { width: 500, height: 500 },
				});

				let video = videoRef.current;
				video.srcObject = stream;
				setTheStream(stream);
				return stream;
			}

			if (actionType === 'screen') {
				stream = navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});

				setTheStream(stream);
				return stream;
			}
		} catch (err) {
			Promise.reject(err);
		}
	};

	const startRecord = async () => {
		// const mediaDevices = await navigator.mediaDevices;
		// const stream =
		// 	actionType === 'video'
		// 		? initialiseCamera()
		// 		: mediaDevices.getDisplayMedia({ video: true, audio: true });

		const stream = await initialiseCamera();

		const recorder = new RecordRTCPromisesHandler(stream, { type: 'video' });

		await recorder.startRecording();
		setTheRecorder(recorder);
		setVideoBlob(null);
	};

	const stopRecord = async () => {
		if (theRecorder) {
			await theRecorder.stopRecording();
			const blob = await theRecorder.getBlob();
			theStream.stop();
			setVideoBlob(blob);
			setTheStream(null);
			setTheRecorder(null);
		}
	};

	const downloadVideo = () => {
		if (videoBlob) {
			saveAs(videoBlob, `Video-${Date.now()}.webm`);
		}
	};

	const changeActionType = () => {
		const theType = actionType === 'video' ? 'screen' : 'video';
		setActionType(theType);
	};

	return (
		<div className='cameraContainer'>
			<div className='icons_box'>
				<div className='icon' onClick={changeActionType}>
					Record {actionType}
				</div>

				<div className='icon' onClick={startRecord}>
					<BsCamera />
				</div>
				<div className='icon' onClick={stopRecord}>
					<FaVideoSlash />
				</div>
				<div className='icon' onClick={downloadVideo}>
					<BsDownload />
				</div>
			</div>

			{/* <div className='cam_box'> */}
			<video ref={videoRef} playsInline autoPlay muted>
				{' '}
			</video>

			{videoBlob && <Player src={window.URL.createObjectURL(videoBlob)} />}
			{/* </div> */}
		</div>
	);
};

export default Camera;
