import React, { useState } from 'react';
import { BsCamera, BsCameraVideoFill, BsDownload } from 'react-icons/bs';
import { FaVideoSlash } from 'react-icons/fa';
import { RecordRTCPromisesHandler } from 'recordrtc';
import { saveAs } from 'file-saver';

import './camera.scss';

const Camera = () => {
	const [actionType, setActionType] = useState('video');
	const [theRecorder, setTheRecorder] = useState(null);
	const [theStream, setTheStream] = useState(null);
	const [videoBlob, setVideoBlob] = useState(null);

	const startRecord = async () => {
		const mediaDevices = await navigator.mediaDevices;
		const stream =
			actionType === 'video'
				? await mediaDevices.getUserMedia({ video: true, audio: true })
				: mediaDevices.getDisplayMedia({ video: true, audio: true });

		const recorder = new RecordRTCPromisesHandler(stream, { type: 'video' });

		await recorder.startRecording();
		setTheRecorder(recorder);
		setTheStream(stream);
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

			<div className='cam_box'></div>
		</div>
	);
};

export default Camera;
