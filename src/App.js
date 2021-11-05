import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const Camera = lazy(() => import('views/CAMERA/Camera'));

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Suspense fallback={<div> Loading... </div>}>
					<Routes>
						<Route path='/' element={<Camera />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;
