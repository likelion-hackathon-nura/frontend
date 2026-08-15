import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SignUp from './pages/Login/SignUp';
import Step1WorkSchedule from './pages/Onboarding/Step1WorkSchedule';
import Step2SleepMeal from './pages/Onboarding/Step2SleepMeal';
import Step3Activity from './pages/Onboarding/Step3Activity';
import Step4SkinInfo from './pages/Onboarding/Step4SkinInfo';
import Complete from './pages/Onboarding/Complete';
import Report from './pages/Report/Report';
import ScanLoading from './pages/WorkSchedule/ScanLoading';
import ScanResult from './pages/WorkSchedule/ScanResult';
import RegisterComplete from './pages/WorkSchedule/RegisterComplete';
import ManualEntry from './pages/WorkSchedule/ManualEntry';
import CategorySelect from './pages/Schedule/CategorySelect';
import DateTimeInput from './pages/Schedule/DateTimeInput';
import RefreshTimeWarning from './pages/Schedule/RefreshTimeWarning';
import AiRecommendation from './pages/Schedule/AiRecommendation';
import ScheduleComplete from './pages/Schedule/ScheduleComplete';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding/step1" element={<Step1WorkSchedule />} />
        <Route path="/onboarding/step2" element={<Step2SleepMeal />} />
        <Route path="/onboarding/step3" element={<Step3Activity />} />
        <Route path="/onboarding/step4" element={<Step4SkinInfo />} />
        <Route path="/onboarding/complete" element={<Complete />} />
        <Route path="/report" element={<Report />} />
        <Route path="/work-schedule/scan-loading" element={<ScanLoading />} />
        <Route path="/work-schedule/scan-result" element={<ScanResult />} />
        <Route path="/work-schedule/register-complete" element={<RegisterComplete />} />
        <Route path="/work-schedule/manual-entry" element={<ManualEntry />} />
        <Route path="/schedule/category" element={<CategorySelect />} />
        <Route path="/schedule/datetime" element={<DateTimeInput />} />
        <Route path="/schedule/warning" element={<RefreshTimeWarning />} />
        <Route path="/schedule/recommend" element={<AiRecommendation />} />
        <Route path="/schedule/complete" element={<ScheduleComplete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
