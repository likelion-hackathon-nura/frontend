import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import Step1WorkSchedule from './pages/Onboarding/Step1WorkSchedule';
import Step2SleepMeal from './pages/Onboarding/Step2SleepMeal';
import Step3Activity from './pages/Onboarding/Step3Activity';
import Step4SkinInfo from './pages/Onboarding/Step4SkinInfo';
import Complete from './pages/Onboarding/Complete';
import Report from './pages/Report/Report';
import Skin from './pages/Skin/Skin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding/step1" element={<Step1WorkSchedule />} />
        <Route path="/onboarding/step2" element={<Step2SleepMeal />} />
        <Route path="/onboarding/step3" element={<Step3Activity />} />
        <Route path="/onboarding/step4" element={<Step4SkinInfo />} />
        <Route path="/onboarding/complete" element={<Complete />} />
        <Route path="/report" element={<Report />} />
        <Route path="/skin" element={<Skin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
