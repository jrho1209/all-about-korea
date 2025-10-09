'use client';
import { useState, useEffect } from 'react';

export default function FineTuningDashboard() {
  const [jobs, setJobs] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileId, setFileId] = useState('');
  const [jobId, setJobId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fineTunedModel, setFineTunedModel] = useState('');

  // Fine-tuning 작업 목록 로드
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/fine-tune');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  // 1단계: 훈련 파일 업로드
  const uploadFile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fine-tune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload_file' })
      });
      
      const data = await response.json();
      if (data.success) {
        setFileId(data.fileId);
        setCurrentStep(2);
        alert('훈련 파일이 성공적으로 업로드되었습니다!');
      }
    } catch (error) {
      alert('파일 업로드 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2단계: Fine-tuning 작업 시작
  const startFineTuning = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fine-tune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_job', fileId })
      });
      
      const data = await response.json();
      if (data.success) {
        setJobId(data.jobId);
        setCurrentStep(3);
        alert('Fine-tuning 작업이 시작되었습니다!');
        loadJobs(); // 목록 새로고침
      }
    } catch (error) {
      alert('Fine-tuning 시작 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3단계: 작업 상태 확인
  const checkJobStatus = async (jobId) => {
    try {
      const response = await fetch('/api/fine-tune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_job', model: jobId })
      });
      
      const data = await response.json();
      if (data.success && data.job.fine_tuned_model) {
        setFineTunedModel(data.job.fine_tuned_model);
        alert(`Fine-tuning 완료! 모델 ID: ${data.job.fine_tuned_model}`);
      }
      loadJobs(); // 목록 새로고침
    } catch (error) {
      alert('상태 확인 실패: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{color: '#B71C1C'}}>
          AI Fine-Tuning Dashboard
        </h1>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep >= step ? 'bg-red-600' : 'bg-gray-300'
                }`}>
                  {step}
                </div>
                <div className={`ml-2 font-medium ${currentStep >= step ? 'text-red-600' : 'text-gray-500'}`}>
                  {step === 1 && '파일 업로드'}
                  {step === 2 && 'Fine-tuning 시작'}
                  {step === 3 && '훈련 완료'}
                </div>
                {step < 3 && <div className={`flex-1 h-1 mx-4 ${currentStep > step ? 'bg-red-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* 단계별 액션 버튼 */}
        <div className="space-y-6">
          {/* 1단계: 파일 업로드 */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">1단계: 훈련 데이터 업로드</h3>
            <p className="text-gray-600 mb-4">
              대전 여행 계획 예시들을 OpenAI에 업로드합니다. (준비된 훈련 데이터: 4개 예시)
            </p>
            <button
              onClick={uploadFile}
              disabled={loading || currentStep > 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '업로드 중...' : '훈련 파일 업로드'}
            </button>
            {fileId && <p className="mt-2 text-green-600">✅ 파일 ID: {fileId}</p>}
          </div>

          {/* 2단계: Fine-tuning 시작 */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">2단계: Fine-tuning 작업 시작</h3>
            <p className="text-gray-600 mb-4">
              업로드된 데이터로 GPT-3.5 모델을 대전 여행 전문가로 훈련시킵니다.
            </p>
            <button
              onClick={startFineTuning}
              disabled={loading || currentStep !== 2}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '시작 중...' : 'Fine-tuning 시작'}
            </button>
            {jobId && <p className="mt-2 text-green-600">✅ 작업 ID: {jobId}</p>}
          </div>

          {/* 3단계: 완료된 모델 */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">3단계: 훈련 완료된 모델</h3>
            <p className="text-gray-600 mb-4">
              Fine-tuning이 완료되면 새로운 맞춤 모델을 사용할 수 있습니다.
            </p>
            {fineTunedModel && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-bold">✅ Fine-tuning 완료!</p>
                <p className="text-green-700">모델 ID: {fineTunedModel}</p>
                <button 
                  onClick={() => {
                    // 실제 AI 생성 API에서 이 모델을 사용하도록 설정
                    localStorage.setItem('fineTunedModel', fineTunedModel);
                    alert('새로운 모델이 설정되었습니다!');
                  }}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  이 모델 사용하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fine-tuning 작업 목록 */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Fine-tuning 작업 목록</h3>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500">아직 Fine-tuning 작업이 없습니다.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">작업 ID: {job.id}</p>
                      <p className="text-sm text-gray-600">상태: {job.status}</p>
                      <p className="text-sm text-gray-600">생성일: {new Date(job.created_at * 1000).toLocaleString()}</p>
                      {job.fine_tuned_model && (
                        <p className="text-sm text-green-600">모델: {job.fine_tuned_model}</p>
                      )}
                    </div>
                    <button
                      onClick={() => checkJobStatus(job.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      상태 확인
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fine-tuning 비용 및 정보 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-bold text-yellow-800 mb-2">💡 Fine-tuning 정보</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• GPT-3.5 Fine-tuning 비용: 훈련 $0.008/1K tokens, 사용 $0.012/1K tokens</li>
            <li>• 최소 10개 예시 필요 (현재 4개 준비됨 - 더 추가 권장)</li>
            <li>• 훈련 시간: 보통 10-30분 소요</li>
            <li>• 훈련 완료 후 기존 프롬프트보다 더 정확한 응답</li>
          </ul>
        </div>
      </div>
    </div>
  );
}